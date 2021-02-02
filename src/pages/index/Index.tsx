import React, {useEffect, useState} from "react";
import ExchangeField from "../../components/ExchangeField";
import {ICurrency} from "../../interfaces";
import {getCurrenciesRequest, getEstimateExchangeAmountRequest, getMinimalExchangeAmountRequest} from "../../api";
import "./Index.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {CurrencyAmount} from "../../types";
import {CurrencyInputChangeHandler} from "../../components/CurrencyInput/CurrencyInput";


type IndexExchangeState = {
  minAmount: number,
  from: {
    id: number,
    amount: CurrencyAmount
    disabled: boolean,
  },
  to: {
    id: number,
    amount: CurrencyAmount,
    disabled: boolean
  }
}

const Index = () => {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [exchangeTimeout, setExchangeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [exchangeError, setExchangeError] = useState<string>("");
  const [exchangeState, setExchangeState] = useState<IndexExchangeState>({
    minAmount: 0,
    from: {
      id: 0,
      amount: null,
      disabled: true
    },
    to: {
      id: 1,
      amount: null,
      disabled: true
    }
  });

  useEffect(() => {
    let tempCurrencies: ICurrency[] = [];

    getCurrenciesRequest()
      .then((response) => {
        setCurrencies(response.data);
        tempCurrencies = response.data;
        return getMinimalExchangeAmountRequest(
          response.data[exchangeState.from.id].ticker,
          response.data[exchangeState.to.id].ticker
        );
      })
      .then((response) => {
        setExchangeState((oldState) => ({
          ...oldState,
          minAmount: response.data.minAmount,
          from: {
            ...oldState.from,
            amount: response.data.minAmount
          }
        }));

        return getEstimateExchangeAmountRequest(
          response.data.minAmount,
          tempCurrencies[exchangeState.from.id].ticker,
          tempCurrencies[exchangeState.to.id].ticker
        );
      })
      .then((response) => {
        setExchangeState((oldValue) => ({
          ...oldValue,
          from: {
            ...oldValue.from,
            disabled: false
          },
          to: {
            ...oldValue.to,
            amount: response.data.estimatedAmount,
            disabled: false
          }
        }));
      });

  }, []);

  const onCurrencyDataChange: CurrencyInputChangeHandler<"from" | "to"> = ({name, value, currencyId}) => {
    const anotherName = name === "from" ? "to":"from";
    const oldExchangeState = {
      ...exchangeState,
      from: {...exchangeState.from},
      to: {...exchangeState.to}
    };

    if (exchangeTimeout !== null) {
      clearTimeout(exchangeTimeout);
    }

    const isValid = (value || 0) >= oldExchangeState.minAmount || name === "to";

    setExchangeError("");

    setExchangeState((oldState) => ({
      ...oldState,
      [name]: {
        ...oldState[name],
        amount: value,
        id: currencyId,
        disabled: currencyId !== oldState[name].id
      },
      [anotherName]: {
        ...oldState[anotherName],
        amount: isValid ? oldState[anotherName].amount:null,
        disabled: true
      }
    }));

    if (isValid) {
      const timeout = setTimeout(() => {
        new Promise((resolve: (x: IndexExchangeState) => void, reject) => {
          const newExchangeState = {...oldExchangeState};
          const fromId = name === "from" ? currencyId:oldExchangeState.from.id;
          const toId = name === "to" ? currencyId:oldExchangeState.to.id;

          if (currencyId !== oldExchangeState[name].id) {
            getMinimalExchangeAmountRequest(currencies[fromId].ticker, currencies[toId].ticker).then((response) => {
              newExchangeState.minAmount = response.data.minAmount;
              newExchangeState.from.id = fromId;
              newExchangeState.from.amount = response.data.minAmount;
              newExchangeState.to.id = toId;

              return getEstimateExchangeAmountRequest(response.data.minAmount, currencies[fromId].ticker, currencies[toId].ticker);
            }).then((response) => {
              newExchangeState.to.amount = response.data.estimatedAmount;
              resolve(newExchangeState);
            }).catch((error) => {
              setExchangeError("This pair is disabled now");
            });
          } else if (value !== oldExchangeState[name].amount) {
            getEstimateExchangeAmountRequest(
              value || 0,
              currencies[currencyId].ticker,
              currencies[oldExchangeState[anotherName].id].ticker
            ).then((response) => {
              newExchangeState[name].amount = value;
              newExchangeState[anotherName].amount = response.data.estimatedAmount;

              resolve(newExchangeState);
            });
          }
        }).then((newExchangeState: IndexExchangeState) => {
          newExchangeState[name].disabled = false;
          newExchangeState[anotherName].disabled = false;

          setExchangeState(newExchangeState);
        });
      }, 1000);

      setExchangeTimeout(timeout);
    }
  };

  const onCurrenciesSwap = () => {
    setExchangeState((oldState) => ({
      ...oldState,
      from: oldState.to,
      to: oldState.from,
    }));
  };

  return (
    <div className="Index">
      <article className="Index__title-block">
        <h1 className="Index__title">Crypto Exchange</h1>
        <p className="Index__description">Exchange fast and easy</p>
      </article>
      {currencies.length > 0 &&
      <ExchangeField
          from={exchangeState.from}
          to={exchangeState.to}
          currencies={currencies}
          onChange={onCurrencyDataChange}
          onCurrenciesSwap={onCurrenciesSwap}
          minAmount={exchangeState.minAmount}
          canChangeCurrencies={!!exchangeError}
      />
      }
      <div className="Index__bottom">
        <label htmlFor="wallet"
               className="Index__wallet-label">Your {currencies[exchangeState.to.id]?.name || "wallet"} address</label>
        <div className="Index__wallet-submit">
          <Input name="wallet" id="wallet" wrapperClassName="Index__wallet"/>
          <Button
            invalidText={exchangeError}
            disabled={exchangeState.to.disabled || exchangeState.from.disabled}
          >
            Exchange
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;