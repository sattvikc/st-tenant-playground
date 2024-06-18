let allFirstFactors = [
  "emailpassword",
  "otp-phone",
  "otp-email",
  "link-phone",
  "link-email",
  "thirdparty",
];

export const update_5 = (body, currentState) => {
    let newTenantState =  {...currentState};

    let firstFactors = currentState.firstFactors;
    let requiredSecondaryFactors = currentState.requiredSecondaryFactors;

    if (body.emailPasswordEnabled === true) {
        newTenantState.emailPasswordEnabled = true;
    }
    if (body.passwordlessEnabled === true) {
        newTenantState.passwordlessEnabled = true;
    }
    if (body.thirdPartyEnabled === true) {
        newTenantState.thirdPartyEnabled = true;
    }

    if (body.firstFactors !== undefined) {
        firstFactors = body.firstFactors;
        if (firstFactors !== null) {
            if (firstFactors.includes("emailpassword")) {
                newTenantState.emailPasswordEnabled = true;
            }
            if (firstFactors.includes("otp-phone") || firstFactors.includes("otp-email") || firstFactors.includes("link-phone") || firstFactors.includes("link-email")) {
                newTenantState.passwordlessEnabled = true;
            }
            if (firstFactors.includes("thirdparty")) {
                newTenantState.thirdPartyEnabled = true;
            }
        }
    }

    if (body.emailPasswordEnabled === false) {
        if (firstFactors !== null) {
            firstFactors = firstFactors.filter((factor) => factor !== "emailpassword");
        }

        if (requiredSecondaryFactors !== null) {
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "emailpassword");
        }

        newTenantState.emailPasswordEnabled = false;
    }
    if (body.passwordlessEnabled === false) {
        if (firstFactors !== null) {
            firstFactors = firstFactors.filter((factor) => factor !== "otp-phone");
            firstFactors = firstFactors.filter((factor) => factor !== "otp-email");
            firstFactors = firstFactors.filter((factor) => factor !== "link-phone");
            firstFactors = firstFactors.filter((factor) => factor !== "link-email");
        }

        if (requiredSecondaryFactors !== null) {
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "otp-phone");
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "otp-email");
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "link-phone");
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "link-email");
        }

        newTenantState.passwordlessEnabled = false;
    }
    if (body.thirdPartyEnabled === false) {
        if (firstFactors !== null) {
            firstFactors = firstFactors.filter((factor) => factor !== "thirdparty");
        }

        if (requiredSecondaryFactors !== null) {
            requiredSecondaryFactors = requiredSecondaryFactors.filter((factor) => factor !== "thirdparty");
        }
        newTenantState.thirdPartyEnabled = false;
    }

    if (requiredSecondaryFactors !== null && requiredSecondaryFactors.length === 0) {
        requiredSecondaryFactors = ["_st_unsupported"];
    }

    newTenantState.firstFactors = firstFactors;
    newTenantState.requiredSecondaryFactors = requiredSecondaryFactors;

    return newTenantState;
};

export const create_5 = (body) => {
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
      emailPasswordEnabled: false,
      passwordlessEnabled: false,
      thirdPartyEnabled: false,
      firstFactors: null,
      requiredSecondaryFactors: null,
    };
  }

  return update_5(body, newTenantState);
};

export const get_5 = (tenantState) => {
  return {
    emailPasswordEnabled: tenantState.emailPasswordEnabled,
    thirdPartyEnabled: tenantState.thirdPartyEnabled,
    passwordlessEnabled: tenantState.passwordlessEnabled,
    firstFactors:
      tenantState.firstFactors !== null && tenantState.firstFactors.length === 0
        ? ["_st_unsupported"]
        : tenantState.firstFactors,
    requiredSecondaryFactors: tenantState.requiredSecondaryFactors,
  };
};
