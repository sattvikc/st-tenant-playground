let allFirstFactors = [
  "emailpassword",
  "otp-phone",
  "otp-email",
  "link-phone",
  "link-email",
  "thirdparty",
];

export const update_v2 = (body, currentState) => {
  let newTenantState = { ...currentState };

  if (body.firstFactors !== undefined) {
    newTenantState.firstFactors = body.firstFactors;

    if (
      newTenantState.firstFactors === null ||
      newTenantState.firstFactors.includes("emailpassword")
    ) {
      newTenantState.emailPasswordEnabled = true;
    }
    if (
      newTenantState.firstFactors === null ||
      newTenantState.firstFactors.includes("otp-phone") ||
      newTenantState.firstFactors.includes("otp-email") ||
      newTenantState.firstFactors.includes("link-phone") ||
      newTenantState.firstFactors.includes("link-email")
    ) {
      newTenantState.passwordlessEnabled = true;
    }
    if (
      newTenantState.firstFactors === null ||
      newTenantState.firstFactors.includes("thirdparty")
    ) {
      newTenantState.thirdPartyEnabled = true;
    }
  }
  if (body.requiredSecondaryFactors !== undefined) {
    newTenantState.requiredSecondaryFactors = body.requiredSecondaryFactors;

    if (
      newTenantState.requiredSecondaryFactors !== null &&
      newTenantState.requiredSecondaryFactors.includes("emailpassword")
    ) {
      newTenantState.emailPasswordEnabled = true;
    }
    if (
      newTenantState.requiredSecondaryFactors !== null &&
      (newTenantState.requiredSecondaryFactors.includes("otp-phone") ||
        newTenantState.requiredSecondaryFactors.includes("otp-email") ||
        newTenantState.requiredSecondaryFactors.includes("link-phone") ||
        newTenantState.requiredSecondaryFactors.includes("link-email"))
    ) {
      newTenantState.passwordlessEnabled = true;
    }
    if (
      newTenantState.requiredSecondaryFactors !== null &&
      newTenantState.requiredSecondaryFactors.includes("thirdparty")
    ) {
      newTenantState.thirdPartyEnabled = true;
    }
  }
  return newTenantState;
};

export const create_v2 = (body) => {
  let newTenantState;
  let { tenantId } = body;

  if (tenantId === "public") {
    newTenantState = {
      tenantId,
      emailPasswordEnabled: true,
      passwordlessEnabled: true,
      thirdPartyEnabled: true,
      firstFactors: null,
      requiredSecondaryFactors: null,
    };
  } else {
    newTenantState = {
      tenantId,
      emailPasswordEnabled: true,
      passwordlessEnabled: true,
      thirdPartyEnabled: true,
      firstFactors: [],
      requiredSecondaryFactors: null,
    };
  }

  if (body.firstFactors !== undefined) {
    newTenantState.firstFactors = body.firstFactors;
  }
  if (body.requiredSecondaryFactors !== undefined) {
    newTenantState.requiredSecondaryFactors = body.requiredSecondaryFactors;
  }

  return update_v2(body, newTenantState);
};

export const get_v2 = (tenantState) => {
  let firstFactors = tenantState.firstFactors;
  if (firstFactors === null) {
    if (
      tenantState.emailPasswordEnabled === false ||
      tenantState.passwordlessEnabled === false ||
      tenantState.thirdPartyEnabled === false
    ) {
      firstFactors = [...allFirstFactors];

      if (tenantState.emailPasswordEnabled === false) {
        firstFactors = firstFactors.filter(
          (factor) => factor !== "emailpassword"
        );
      }
      if (tenantState.passwordlessEnabled === false) {
        firstFactors = firstFactors.filter((factor) => factor !== "otp-phone");
        firstFactors = firstFactors.filter((factor) => factor !== "otp-email");
        firstFactors = firstFactors.filter((factor) => factor !== "link-phone");
        firstFactors = firstFactors.filter((factor) => factor !== "link-email");
      }
      if (tenantState.thirdPartyEnabled === false) {
        firstFactors = firstFactors.filter((factor) => factor !== "thirdparty");
      }
    }
  }
  return {
    firstFactors: firstFactors,
    requiredSecondaryFactors: tenantState.requiredSecondaryFactors,
  };
};



export const cdi51CoreBehaviour = (tenantState) => {
  let res = "Core does not block any of the APIs";
  return res;
};

export const backendCdi51Behaviour = (tenantState) => {
  let state = get_v2(tenantState);

  let res = "";

  res += "firstFactors from core: ";
  if (state.firstFactors === null) {
    res += "✗\n";
  } else {
    res += "✓\n";
  }

  res += "enabled booleans in tenant: ✗\n";

  res += "mfa init firstFactors: ";
  if (state.firstFactors !== null) {
    res += "✗\n";
  } else {
    res += "✓\n";
  }

  res += "initialised recipes: ";
  res += "✓\n";

  res += '\nfinal output: ';

  let out = {...state};
  if (state.firstFactors === null) {
    out.firstFactors = "intersection of mfa init firstFactors and initialised recipes";
  } else {
    if (state.firstFactors.length === 0) {
      out.firstFactors = []
    } else {
      out.firstFactors = "intersection of " + JSON.stringify(state.firstFactors) + " and initialised recipes";
    }
  }
  delete out.requiredSecondaryFactors;
  out.emailPasswordEnabled = "isEmailPasswordInitialised?";
  out.passwordlessEnabled = "isPasswordlessInitialised?";
  out.thirdPartyEnabled = "isThirdPartyInitialised?";
  res += JSON.stringify(out, null, 2).replaceAll("\\\"", "'") + "\n";

  return res;
};

export const frontendCdi51Behaviour = (tenantState) => {
  let res = "";

  res += 'ui shows: firstFactors from loginMethodsGET API';

  return res;
}
