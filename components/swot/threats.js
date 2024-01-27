import { useEffect, useState } from "react";
import { useAppContext } from "../../context";

import axios from "axios";

import React from "react";
import { WindowedMenuList } from "react-windowed-select";
import CreatableSelect from "react-select/creatable";
import threatsData from "./data/threats.json";
import { useRouter } from "next/router";


import { toast } from "react-toastify";
import HorizontalPaddings from "../../components/layout/HorizontalPaddings";
const options = threatsData.threats.map((threat) => ({
  label: threat,
  value: threat,
}));
const Threats = () => {

  const [threats, setThreats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const existingData = localStorage.getItem('swotData');
      
       const swotData = existingData ? JSON.parse(existingData) : { threats: [] };
       if (swotData.threats==null) {
         swotData.threats = [];
       }

      setThreats(swotData.threats);
  }, []);

  const { user, onboarding, setUser } = useAppContext();

  

  const onPrevious = async (e) => {
    router.push("/user/onboarding/profile");
  };

  
  const onChange = (e) => {
    

    if (threats?.length < 10) {
     setThreats(e);
   //   console.log(e);
      const existingData = localStorage.getItem('swotData');
     
      const swotData = existingData ? JSON.parse(existingData) : { threats: [] };
      if (swotData.threats==null) {
        swotData.threats = [];
      }
      //Clear swotData.threats
       swotData.threats = [];

      e.forEach(obj => swotData.threats.push(obj));
      localStorage.setItem('swotData', JSON.stringify(swotData));
  
    }

   
 };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full pt-8 mb-auto">
        <HorizontalPaddings className="w-[715px] flex flex-col text-center leading-tight">
          <div className="mb-4 text-3xl">
            What are your threats?
          </div>
          <div>You can update this later in profile settings.</div>
          <div className="mt-8" />
          <Selector threats={threats} onChange={onChange} />
        </HorizontalPaddings>
      </div>

      <hr className="mb-8 border-g-divider" />

      <div className="mb-8" />
    </div>
  );
};

const Selector = ({ threats, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <CreatableSelect
        className="basic-multi-select"
        placeholder="Search threats by keyword"
        components={{ MenuList: WindowedMenuList }}
        isMulti
        value={threats}
        options={options}
        classNamePrefix="select"
        onChange={onChange}
        id="long-value-select"
        instanceId="long-value-select"
      />
      <div
        className={`flex text-xs ${
          threats?.length >= 3 && threats?.length < 10
            ? "text-g-error-red"
            : "text-g-text-light-grey"
        }`}
      >
        {threats?.length ?? 0}/10
      </div>
    </div>
  );
};


export default Threats;
