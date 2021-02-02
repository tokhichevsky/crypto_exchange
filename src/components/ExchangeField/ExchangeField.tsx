import React from "react";
import CurrencyInput, {CurrencyInputChangeHandler} from "../CurrencyInput/CurrencyInput";
import {ICurrency} from "../../interfaces";
import "./ExchangeField.scss";
import Icon from "../../icons/Icon";
import {CurrencyAmount} from "../../types";


type ExchangeFieldProps = {
  currencies: ICurrency[],
  onChange?: CurrencyInputChangeHandler<"from" | "to">,
  onCurrenciesSwap?: () => void,
  from: {
    id: number,
    amount: CurrencyAmount,
    disabled: boolean
  }
  to: {
    id: number,
    amount: CurrencyAmount,
    disabled: boolean
  }
  minAmount: number
  canChangeCurrencies?: boolean
}

const ExchangeField = (props: ExchangeFieldProps) => {
  const currenciesSwapHandler = () => {
    !props.to.disabled && !props.from.disabled && props.onCurrenciesSwap && props.onCurrenciesSwap();
  };

  return (
    <div className="ExchangeField">
      <CurrencyInput
        name="from"
        currencies={props.currencies}
        value={props.from.amount}
        selectedCurrencyId={props.from.id}
        occupiedCurrencyId={props.to.id}
        disabled={props.from.disabled && !props.canChangeCurrencies}
        inputDisabled={props.from.disabled}
        onChange={props.onChange}
        min={props.minAmount}
      />
      <div
        className={`ExchangeField__exchange-button 
      ${props.to.disabled || props.from.disabled ? "ExchangeField__exchange-button_disabled":""}`}
        onClick={currenciesSwapHandler}
      >
        <Icon className="ExchangeField__exchange-icon" name="swap" width="24" height="24"/>
      </div>
      <CurrencyInput
        name="to"
        currencies={props.currencies}
        value={props.to.amount}
        selectedCurrencyId={props.to.id}
        occupiedCurrencyId={props.from.id}
        disabled={props.to.disabled && !props.canChangeCurrencies}
        onChange={props.onChange}
        inputDisabled={true}
      />
    </div>
  );
};

ExchangeField.defaultProps = {
  canChangeCurrencies: true
};

export default ExchangeField;