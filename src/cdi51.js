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

  res += "loginMethodsGET returns booleans as per the initialised recipes and not based on core\n\n";

  if (state.requiredSecondaryFactors === null) {
      res += "tenant doesn't require any secondary factors unless user overrides getRequirementsForAuth\n"
  } else {
      res += "tenant will require one of " + JSON.stringify(state.requiredSecondaryFactors) + " as secondary factor unless user overrides getRequirementsForAuth\n";
  }
  return res;
};

export const frontendCdi51Behaviour = (tenantState) => {
  let res = 'If using dynamic login methods, frontend will use output of firstFactors to show the first factor login UI. For the secondary factors, it will be picked up from the next array determined by getRequirementsForAuth to show a login method to the user';

  res += '\n\n';
  res += 'Else, frontend will show statically defined login methods\n'
  return res
}
