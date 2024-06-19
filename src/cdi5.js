let allFirstFactors = [
  "emailpassword",
  "otp-phone",
  "otp-email",
  "link-phone",
  "link-email",
  "thirdparty",
];

export const update_5 = (body, currentState) => {
  let newTenantState = { ...currentState };

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
      if (
        firstFactors.includes("otp-phone") ||
        firstFactors.includes("otp-email") ||
        firstFactors.includes("link-phone") ||
        firstFactors.includes("link-email")
      ) {
        newTenantState.passwordlessEnabled = true;
      }
      if (firstFactors.includes("thirdparty")) {
        newTenantState.thirdPartyEnabled = true;
      }
    }
  }

  if (body.requiredSecondaryFactors !== undefined) {
    requiredSecondaryFactors = body.requiredSecondaryFactors;
    if (requiredSecondaryFactors !== null) {
      if (requiredSecondaryFactors.includes("emailpassword")) {
        newTenantState.emailPasswordEnabled = true;
      }
      if (
        requiredSecondaryFactors.includes("otp-phone") ||
        requiredSecondaryFactors.includes("otp-email") ||
        requiredSecondaryFactors.includes("link-phone") ||
        requiredSecondaryFactors.includes("link-email")
      ) {
        newTenantState.passwordlessEnabled = true;
      }
      if (requiredSecondaryFactors.includes("thirdparty")) {
        newTenantState.thirdPartyEnabled = true;
      }
    }
  }

  if (body.emailPasswordEnabled === false) {
    if (firstFactors !== null) {
      firstFactors = firstFactors.filter(
        (factor) => factor !== "emailpassword"
      );
    }

    if (requiredSecondaryFactors !== null) {
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "emailpassword"
      );
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
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "otp-phone"
      );
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "otp-email"
      );
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "link-phone"
      );
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "link-email"
      );
    }

    newTenantState.passwordlessEnabled = false;
  }
  if (body.thirdPartyEnabled === false) {
    if (firstFactors !== null) {
      firstFactors = firstFactors.filter((factor) => factor !== "thirdparty");
    }

    if (requiredSecondaryFactors !== null) {
      requiredSecondaryFactors = requiredSecondaryFactors.filter(
        (factor) => factor !== "thirdparty"
      );
    }
    newTenantState.thirdPartyEnabled = false;
  }

  if (
    requiredSecondaryFactors !== null &&
    requiredSecondaryFactors.length === 0
  ) {
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

export const cdi5CoreBehaviour = (tenantState) => {
    let state = get_5(tenantState);
    let res = "";
  
    if (state.emailPasswordEnabled === false) {
      res += "emailpassword APIs are blocked\n";
    } else {
      res += "emailpassword APIs are allowed\n";
    }
  
    if (state.passwordlessEnabled === false) {
      res += "passwordless APIs are blocked\n";
    } else {
      res += "passwordless APIs are allowed\n";
    }
  
    if (state.thirdPartyEnabled === false) {
      res += "thirdParty APIs are blocked\n";
    } else {
      res += "thirdParty APIs are allowed\n";
    }
  
    return res;
  };

export const backendCdi5Behaviour = (tenantState) => {
    let state = get_5(tenantState);
  
    let res = "loginMethodsGET has the following output for firstFactors: ";
    res += "\n";

    let filteredRecipes = '';
    if (state.emailPasswordEnabled === false) {
        filteredRecipes += "emailpassword ";
    }
    if (state.passwordlessEnabled === false) {
        filteredRecipes += "passwordless ";
    }
    if (state.thirdPartyEnabled === false) {
        filteredRecipes += "thirdparty ";
    }

    if (state.firstFactors === null) {
        res += "if MFA first factors is initialised:\n";
        if (filteredRecipes !== '') {
            res += "  filter out " + filteredRecipes + "related factors\n";
        } else {
            res += "  configured firstFactors\n"
        }
        res += "else:\n"
        res += "  all available factors based on initialised recipes"
        if (filteredRecipes !== '') {
            res += " and filtering out " + filteredRecipes + "related factors";
        }
        res += '\n';
    } else {
        res += "  " + JSON.stringify(state.firstFactors) + "\n";
    }
    res += "\n";

    res += "loginMethodsGET also returns booleans as per the output above\n\n";

    if (state.requiredSecondaryFactors === null) {
        res += "tenant doesn't require any secondary factors unless user overrides getRequirementsForAuth\n"
    } else {
        res += "tenant will require one of " + JSON.stringify(state.requiredSecondaryFactors) + " as secondary factor unless user overrides getRequirementsForAuth\n";
    }
    return res;
  };
  
  export const frontendCdi5Behaviour = (tenantState) => {
    let res = 'If using dynamic login methods, frontend will use output of firstFactors to show the first factor login UI. For the secondary factors, it will be picked up from the next array determined by getRequirementsForAuth and then uses the booleans to determine if a login method can be shown to the user';
  
    res += '\n\n';
    res += 'Else, frontend will show statically defined login methods\n'
    return res
  }
  