import { TotalPlanData, user } from "./interfaces";

export const baseUserModel: user = {
  id: 0.1,
  forename: "",
  surname: "",
  email: "",
  disabled: false,
  date_created: "",
};

export const APIUrl = "http://localhost:8000/";

export const baseTotalPlanDataModel: TotalPlanData = {
  id: 0.1,
  type: 0.1,
  date_created: "Now",
  owner_id: 0.1,
  users: 0.1,
  total_cost: 0.1,
  SubClasses: [
    {
      id: 0.1,
      name: "guest",
      plan_id: 0.1,
      appliances: [
        {
          id: 0.1,
          data: "stuff",
          name: "appliance",
          date_created: "Now",
        },
      ],
      date_created: "Now",
    },
  ],
};
