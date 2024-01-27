import { useEffect, useState } from "react";
import { useAppContext } from "../../context";

import axios from "axios";

import React from "react";
import { WindowedMenuList } from "react-windowed-select";
import CreatableSelect from "react-select/creatable";
import strengthData from "./data/strengths.json";
import { useRouter } from "next/router";


import { toast } from "react-toastify";
import HorizontalPaddings from "../../components/layout/HorizontalPaddings";
const options = strengthData.strengths.map((strength) => ({
  label: strength,
  value: strength,
}));
const Strengths = () => {

  useEffect(() => {
    const existingData = localStorage.getItem('swotData');
      
       const swotData = existingData ? JSON.parse(existingData) : { strengths: [] };
       if (swotData.strengths==null) {
         swotData.strengths = [];
       }

      setStrengths(swotData.strengths);
  }, []);

  const { user, onboarding, setUser } = useAppContext();

  const [strengths, setStrengths] = useState([]);
  const router = useRouter();

  const onPrevious = async (e) => {
    router.push("/user/onboarding/profile");
  };

  
  const onChange = (e) => {
    

     if (strengths?.length < 10) {
      setStrengths(e);
    //   console.log(e);
       const existingData = localStorage.getItem('swotData');
      
       const swotData = existingData ? JSON.parse(existingData) : { strengths: [] };
       if (swotData.strengths==null) {
         swotData.strengths = [];
       }
       //Clear swotData.strengths
        swotData.strengths = [];

       e.forEach(obj => swotData.strengths.push(obj));
       localStorage.setItem('swotData', JSON.stringify(swotData));
   
     }

    
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full pt-8 mb-auto">
        <HorizontalPaddings className="w-[715px] flex flex-col text-center leading-tight">
          <div className="mb-4 text-3xl">
            What are your strengths?
          </div>
          <div>You can update this later in profile settings.</div>
          <div className="mt-8" />
          <Selector strengths={strengths} onChange={onChange} />
        </HorizontalPaddings>
      </div>

      <hr className="mb-8 border-g-divider" />

      <div className="mb-8" />
    </div>
  );
};

const Selector = ({ strengths, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <CreatableSelect
        className="basic-multi-select"
        placeholder="Search strengths by keyword"
        components={{ MenuList: WindowedMenuList }}
        isMulti
        value={strengths}
        options={options}
        classNamePrefix="select"
        onChange={onChange}
        id="long-value-select"
        instanceId="long-value-select"
      />
      <div
        className={`flex text-xs ${
          strengths?.length >= 3 && strengths?.length < 10
            ? "text-g-error-red"
            : "text-g-text-light-grey"
        }`}
      >
        {strengths?.length ?? 0}/10
      </div>
    </div>
  );
};


export default Strengths;
