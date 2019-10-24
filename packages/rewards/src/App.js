import './App.css';
import "@clayui/css/lib/css/atlas.css";

import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input';

function App() {
  const [entry, setEntry] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopGain, setStopGain] = useState(0);

  const balance = 5000;
  const riskToReward = 3;
  const maxRisk = 0.02;

  const calculateMaxStopLoss = () => entry - 0.02 * entry;

  useEffect(() => {
    setStopLoss(calculateMaxStopLoss());
  }, [entry]);

  const calculateMinStopGain = () => entry + (entry - stopLoss) * riskToReward;

  useEffect(() => {
    const minStopGain = calculateMinStopGain();
    
    setStopGain(minStopGain);

    const maxStopLoss = calculateMaxStopLoss();

    if (stopLoss > maxStopLoss) {
      setStopLoss(maxStopLoss);
    }
  }, [stopLoss]);

  const resetStopGain = () => {
    setStopGain(calculateMinStopGain());
  }

  return (
    <div className="App">
      <div className="container">
        <h6 className="p-2">Risk to Reward</h6>

        <div className="form-group text-left">
          <label>Entry</label>
          <CurrencyInput
            className="form-control"
            onChange={() => { }}
            onChangeEvent={(event, maskedValue, floatValue) => {
              setEntry(floatValue);
            }}
            prefix="R$"
            value={entry}
          />
        </div>

        <div className="form-group text-left">
          <label>Stop Loss</label>
          <CurrencyInput
            className="form-control"
            onChange={() => { }}
            onChangeEvent={(event, maskedValue, floatValue) => {
              setStopLoss(floatValue);
            }}
            prefix="R$"
            value={stopLoss}
          />
        </div>

        <div className="form-group text-left">
          <label>
              <span>Stop Gain</span>
              <a className="d-inline-block ml-2" href="#" onClick={resetStopGain}>(Reset)</a>
            </label>
          <CurrencyInput
            className="form-control"
            onChange={() => { }}
            onChangeEvent={(event, maskedValue, floatValue) => {
              setStopGain(floatValue);
            }}
            prefix="R$"
            value={stopGain}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
