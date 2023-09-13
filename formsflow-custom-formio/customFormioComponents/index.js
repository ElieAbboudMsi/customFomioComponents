// Import any other new components or templates here.
import TextAreaWithAnalytics from "./TextAreaWithAnalytics/TextAreaWithAnalytics";
import facilitiesCustomComp from "./Facilities";
import photoCapture from "./capturePhoto"
import geolocation from "./Geolocation"
import conditionalDropDownCustomComp from "./ConditionalDropDown"
import companyCustomComp from "./Company"
import companyUsersCustomComp from "./CompanyUsersDropdown"
import companyRelationCustomComp from "./CompanyRelation"
import getAllCustomComp from "./GetAll"
import generalAPICustomComp from "./GeneralAPI";
import normalSelectCustomComp from "./NormalSelectAPI";

// Add imported components to the components object
const components = {
  textAreaWithAnalytics: TextAreaWithAnalytics,
  normalSelectCustomComp:NormalSelectAPI,
  generalAPICustomComp:GeneralAPI,
  photoCapture:capturePhoto,
};

export default {
  components : components
};

