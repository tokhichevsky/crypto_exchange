import axios, {AxiosResponse} from "axios";
import {ICurrency} from "./interfaces";

const instance = axios.create({
  baseURL: "https://api.changenow.io/v1/",
  params: {
    api_key: "c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd"
  }
});

export function getCurrenciesRequest(active?: boolean, fixedRate?: boolean):
  Promise<AxiosResponse<ICurrency[]>> {
  return instance.get("/currencies", {
    params: {
      active,
      fixedRate
    }
  });
}

export function getEstimateExchangeAmountRequest(sendAmount: number, fromTicker: string, toTicker: string):
  Promise<AxiosResponse<{
    estimatedAmount: number,
    transactionSpeedForecast: string,
    warningMessage: null | string
  }>> {
  return instance.get(`/exchange-amount/${sendAmount}/${fromTicker}_${toTicker}/`);
}

export function getMinimalExchangeAmountRequest(fromTicker: string, toTicker: string):
  Promise<AxiosResponse<{ minAmount: number }>> {
  return instance.get(`/min-amount/${fromTicker}_${toTicker}/`);
}

