import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import Icon from "../../icons/Icon";
import {ICurrency} from "../../interfaces";
import "./CurrencyInput.scss";
import {CurrencyAmount} from "../../types";

export type CurrencyInputChangeHandler<TName = any> = ({name, value, currencyId}: { name: TName, value: CurrencyAmount, currencyId: number }) => void;

interface ICurrencyInputProps {
  name: string,
  value: CurrencyAmount,
  selectedCurrencyId: number,
  occupiedCurrencyId: number,
  currencies: ICurrency[],
  className?: string,
  onChange?: CurrencyInputChangeHandler,
  disabled?: boolean,
  inputDisabled?: boolean
  min?: number
}

const CurrencyInput = (props: ICurrencyInputProps) => {
  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange({
      name: props.name,
      value: Number(event.target.value),
      currencyId: props.selectedCurrencyId
    });
  };

  const onCurrencySelect = (id: number) => {
    props.onChange && props.onChange({
      name: props.name,
      value: props.value,
      currencyId: id
    });
    setShowSearch(false);
  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const currencyInputRef = useRef(null);

  const indexedCurrencies = useMemo(
    () => props.currencies.map((currency, index) => ({...currency, id: index})),
    [props.currencies]
  );

  const freeCurrencies = useMemo(
    () => {
      const newFreeCurrencies = [...indexedCurrencies];

      newFreeCurrencies.splice(props.selectedCurrencyId, 1);
      const newOccupiedCurrencyId = props.occupiedCurrencyId - Number(props.occupiedCurrencyId > props.selectedCurrencyId);
      newFreeCurrencies.splice(newOccupiedCurrencyId, 1);

      return newFreeCurrencies;
    },
    [indexedCurrencies, props.selectedCurrencyId, props.occupiedCurrencyId]);

  const foundCurrencies = useMemo(
    () =>
      freeCurrencies.filter((currency) => (currency.name + " " + currency.ticker).toLowerCase().includes(searchValue.toLowerCase())),
    [freeCurrencies, searchValue]
  );

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(
    () => {
      const onNotCurrencyPickerClick = (event: MouseEvent | any) => {
        if (!event.path?.includes(currencyInputRef.current)) {
          setShowSearch(false);
        }
      };

      document.addEventListener("click", onNotCurrencyPickerClick);

      return () => document.removeEventListener("click", onNotCurrencyPickerClick);
    },
    []
  );

  useEffect(
    () => {
      setShowSearch(false);
    },
    [props.disabled]
  );

  return (
    <div
      className={`CurrencyInput ${props.className || ""} ${showSearch ? "CurrencyInput_show-search":""}`}
      ref={currencyInputRef}
    >
      <div className="form-control CurrencyInput-primary">
        <input
          type={props.value !== null ? "number":"text"}
          value={props.value || "—"}
          className="CurrencyInput__input"
          onChange={onValueChange}
          disabled={props.value === null || props.disabled || props.inputDisabled}
        />

      </div>
      <div
        className={`form-control CurrencyInput-additional ${props.disabled ? "CurrencyInput-additional_disabled":""}`}
        onClick={() => !showSearch && !props.disabled && setShowSearch(true)}
      >
        <div className="CurrencyInput__delimiter"/>

        {showSearch ?
          <>
            <input
              placeholder="Search"
              value={searchValue}
              onChange={onSearchInputChange}
              autoFocus
              className="CurrencyInput__search-currency"
            />
          </>
          :
          <div className="CurrencyInput__selected-currency">
            <img
              className="CurrencyInput__selected-currency-icon"
              alt="Currency icon"
              src={props.currencies[props.selectedCurrencyId].image}
            />
            {props.currencies[props.selectedCurrencyId].ticker}
          </div>
        }

        {showSearch ?
          <Icon
            className="CurrencyInput__clear-button"
            name="cross"
            onClick={() => setShowSearch(false)}
          />
          :
          <Icon
            className="CurrencyInput__select-button"
            name="arrowDown"
          />
        }
      </div>
      <div className="currencies-picker">
        {foundCurrencies.map((currency, index) => (
          <div
            key={`currency_${index}`}
            className="currencies-picker__currency"
            onClick={onCurrencySelect.bind(null, currency.id)}
          >
            <img
              className="currencies-picker__currency-icon"
              alt="Currency icon"
              loading="lazy"
              src={currency.image}
            />
            <span className="currencies-picker__currency-ticker">{currency.ticker}</span>
            <span className="currencies-picker__currency-name">{currency.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyInput;