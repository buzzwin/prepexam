import { useEffect, useState } from "react";
import { useAppContext } from "../../app/context";

import axios from "axios";

import React from "react";
import { WindowedMenuList } from "react-windowed-select";
import opportunityData from "./data/opportunities.json";
import { useRouter } from "next/router";


import { toast } from "react-toastify";
import HorizontalPaddings from "../../components/layout/HorizontalPaddings";
const options = opportunityData.opportunities.map((opportunity) => ({
  label: opportunity,
  value: opportunity,
}));
const Opportunities = () => {

  useEffect(() => {
    const existingData = localStorage.getItem('swotData');
      
    const swotData = existingData ? JSON.parse(existingData) : { opportunities: [] };
    if (swotData.opportunities==null) {
      swotData.opportunities = [];
    }

   setOpportunities(swotData.opportunities);
    
    //Runs only on the first render
  }, []);

  const { user, onboarding, setUser } = useAppContext();

  const [opportunities, setOpportunities] = useState([]);
  const router = useRouter();

  const onPrevious = async (e) => {
    router.push("/user/onboarding/profile");
  };

  
  const onChange = (e) => {
    

    if (opportunities?.length < 10) {
     setOpportunities(e);
   //   console.log(e);
      const existingData = localStorage.getItem('swotData');
     
      const swotData = existingData ? JSON.parse(existingData) : { opportunities: [] };
      if (swotData.opportunities==null) {
        swotData.opportunities = [];
      }
      //Clear swotData.opportunities
       swotData.opportunities = [];

      e.forEach(obj => swotData.opportunities.push(obj));
      localStorage.setItem('swotData', JSON.stringify(swotData));
  
    }

   
 };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full pt-8 mb-auto">
        <HorizontalPaddings className="w-[715px] flex flex-col text-center leading-tight">
          <div className="mb-4 text-3xl">
            What are your Opportunities?
          </div>
          <div>You can update this later in profile settings.</div>
          <div className="mt-8" />
          <Selector opportunities={opportunities} onChange={onChange} />
        </HorizontalPaddings>
      </div>

      <hr className="mb-8 border-g-divider" />

      <div className="mb-8" />
    </div>
  );
};

const Selector = ({ opportunities, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <Select
        className="basic-multi-select"
        placeholder="Search opportunities by keyword"
        components={{ MenuList: WindowedMenuList }}
        isMulti
        value={opportunities}
        options={options}
        classNamePrefix="select"
        onChange={onChange}
        id="long-value-select"
        instanceId="long-value-select"
      />
      <div
        className={`flex text-xs ${
          opportunities?.length >= 3 && opportunities?.length < 10
            ? "text-g-error-red"
            : "text-g-text-light-grey"
        }`}
      >
        {opportunities?.length ?? 0}/10
      </div>
    </div>
  );
};


export default Opportunities;
