let allFirstFactors = [
  "emailpassword",
  "otp-phone",
  "otp-email",
  "link-phone",
  "link-email",
  "thirdparty",
];

export const update_4 = (body, currentState) => {
  let newTenantState = { ...currentState };

  let firstFactors = currentState.firstFactors;
  if (firstFactors === null) {
    firstFactors = [...allFirstFactors];
  }

  if (body.emailPasswordEnabled === true) {
    newTenantState.emailPasswordEnabled = true;
    if (firstFactors !== null) {
      if (!firstFactors.includes("emailpassword")) {
        firstFactors.push("emailpassword");
      }
    }
  }
  if (body.passwordlessEnabled === true) {
    newTenantState.passwordlessEnabled = true;
    if (newTenantState.firstFactors !== null) {
      if (
        !firstFactors.includes("otp-phone") &&
        !firstFactors.includes("otp-email") &&
        !firstFactors.includes("link-phone") &&
        !firstFactors.includes("link-email")
      ) {
        firstFactors.push("otp-phone");
        firstFactors.push("otp-email");
        firstFactors.push("link-phone");
        firstFactors.push("link-email");
      }
    }
  }
  if (body.thirdPartyEnabled === true) {
    newTenantState.thirdPartyEnabled = true;
    if (firstFactors !== null) {
      if (!firstFactors.includes("thirdparty")) {
        firstFactors.push("thirdparty");
      }
    }
  }

  if (
    body.emailPasswordEnabled === false ||
    newTenantState.emailPasswordEnabled === false
  ) {
    firstFactors = firstFactors.filter((factor) => factor !== "emailpassword");
  }
  if (
    body.passwordlessEnabled === false ||
    newTenantState.passwordlessEnabled === false
  ) {
    firstFactors = firstFactors.filter(
      (factor) =>
        factor !== "otp-phone" &&
        factor !== "otp-email" &&
        factor !== "link-phone" &&
        factor !== "link-email"
    );
  }
  if (
    body.thirdPartyEnabled === false ||
    newTenantState.thirdPartyEnabled === false
  ) {
    firstFactors = firstFactors.filter((factor) => factor !== "thirdparty");
  }

  newTenantState.firstFactors = firstFactors;

  return newTenantState;
};

export const create_4 = (body) => {
  let { tenantId } = body;
  let newTenantState;
  if (tenantId === "public") {
    newTenantState = {
      tenantId,
      emailPasswordEnabled: true,
      passwordlessEnabled: true,
      thirdPartyEnabled: true,
      firstFactors: [...allFirstFactors],
      requiredSecondaryFactors: null,
    };
  } else {
    newTenantState = {
      tenantId,
      emailPasswordEnabled: false,
      passwordlessEnabled: false,
      thirdPartyEnabled: false,
      firstFactors: [],
      requiredSecondaryFactors: null,
    };
  }

  return update_4(body, newTenantState);
};

export const get_4 = (tenantState) => {
  return {
    emailPasswordEnabled:
      tenantState.emailPasswordEnabled &&
      (tenantState.firstFactors === null ||
        tenantState.firstFactors.includes("emailpassword")),
    thirdPartyEnabled:
      tenantState.thirdPartyEnabled &&
      (tenantState.firstFactors === null ||
        tenantState.firstFactors.includes("thirdparty")),
    passwordlessEnabled:
      tenantState.passwordlessEnabled &&
      (tenantState.firstFactors === null ||
        tenantState.firstFactors.includes("otp-phone") ||
        tenantState.firstFactors.includes("otp-email") ||
        tenantState.firstFactors.includes("link-phone") ||
        tenantState.firstFactors.includes("link-email")),
  };
};
