import React from "react";
import { useState } from "react";
import "./index.css";
import { create_4, get_4, update_4 } from "./cdi4";
import { create_5, get_5, update_5 } from "./cdi5";
import { create_v2, get_v2, update_v2 } from "./cdi51";

export default function App(props) {
  const [tenantState, setTenantState] = useState({
    tenantId: "undefined",
    emailPasswordEnabled: false,
    passwordlessEnabled: false,
    thirdPartyEnabled: false,
    firstFactors: [],
    requiredSecondaryFactors: null,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [cdi4body, setCdi4Body] = useState('{\n  "tenantId": "public"\n}');
  const [cdi5body, setCdi5Body] = useState('{\n  "tenantId": "public"\n}');
  const [v2body, setV2Body] = useState('{\n  "tenantId": "public"\n}');

  return (
    <div className="App">
      <h3>DB State</h3>
      <pre>{JSON.stringify(tenantState, null, 2)}</pre>

      <div className="row">
        <div>
          <h3>Get in 4.0</h3>
          <pre>{JSON.stringify(get_4(tenantState), null, 2)}</pre>
        </div>
        <div>
          <h3>Get in 5.0</h3>
          <pre>{JSON.stringify(get_5(tenantState), null, 2)}</pre>
        </div>
        <div>
          <h3>Get in v2</h3>
          <pre>{JSON.stringify(get_v2(tenantState), null, 2)}</pre>
        </div>
      </div>

      <div className="row">
        <h2>Create / Update</h2>
      </div>

      <div className="row">
        <div>
          <textarea
            value={cdi4body}
            onChange={(e) => {
              setCdi4Body(e.target.value);
            }}
          ></textarea>
          <button
            onClick={() => {
              setTenantState(create_4(JSON.parse(cdi4body)));
            }}
          >
            Create
          </button>
          <button
            onClick={() => {
              setTenantState(update_4(JSON.parse(cdi4body), tenantState));
            }}
          >
            Update
          </button>
        </div>
        <div>
          <textarea
            value={cdi5body}
            onChange={(e) => {
              setCdi5Body(e.target.value);
            }}
          ></textarea>
          <button
            onClick={() => {
              setTenantState(create_5(JSON.parse(cdi5body)));
            }}
          >
            Create
          </button>
          <button
            onClick={() => {
              setTenantState(update_5(JSON.parse(cdi5body), tenantState));
            }}
          >
            Update
          </button>
        </div>
        <div>
          <textarea
            value={v2body}
            onChange={(e) => {
              setV2Body(e.target.value);
            }}
          ></textarea>
          <button
            onClick={() => {
              setTenantState(create_v2(JSON.parse(v2body)));
            }}
          >
            Create
          </button>
          <button
            onClick={() => {
              setTenantState(update_v2(JSON.parse(v2body), tenantState));
            }}
          >
            Update
          </button>
        </div>
      </div>

      <div className="error">{errorMsg}</div>
    </div>
  );
}
