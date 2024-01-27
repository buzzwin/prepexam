import { useEffect, useState } from "react";
import { useAppContext } from "../../context";

import axios from "axios";

import React from "react";
import { WindowedMenuList } from "react-windowed-select";
import CreatableSelect from "react-select/creatable";
import weaknessesData from "./data/weaknesses.json";
import { useRouter } from "next/router";


import { toast } from "react-toastify";
import HorizontalPaddings from "../../components/layout/HorizontalPaddings";
const options = weaknessesData.weaknesses.map((weakness) => ({
  label: weakness,
  value: weakness,
}));
const Weaknesses = () => {

  useEffect(() => {
    const existingData = localStorage.getItem('swotData');
      
    const swotData = existingData ? JSON.parse(existingData) : { weaknesses: [] };
    if (swotData.weaknesses==null) {
      swotData.weaknesses = [];
    }

   setWeaknesses(swotData.weaknesses);
    
    //Runs only on the first render
  }, []);

  const { user, onboarding, setUser } = useAppContext();

  const [weaknesses, setWeaknesses] = useState([]);
  const router = useRouter();

  const onPrevious = async (e) => {
    router.push("/user/onboarding/profile");
  };

  
  const onChange = (e) => {
    if (weaknesses?.length < 10) {
      setWeaknesses(e);
    //   console.log(e);
       const existingData = localStorage.getItem('swotData');
      
       const swotData = existingData ? JSON.parse(existingData) : { weaknesses: [] };
       if (swotData.weaknesses==null) {
         swotData.weaknesses = [];
       }
       //Clear swotData.weaknesses
        swotData.weaknesses = [];

       e.forEach(obj => swotData.weaknesses.push(obj));
       localStorage.setItem('swotData', JSON.stringify(swotData));
   
     }


    
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full pt-8 mb-auto">
        <HorizontalPaddings className="w-[715px] flex flex-col text-center leading-tight">
          <div className="mb-4 text-3xl">
            What are your weaknesses?
          </div>
          <div>You can update this later in profile settings.</div>
          <div className="mt-8" />
          <Selector weaknesses={weaknesses} onChange={onChange} />
        </HorizontalPaddings>
      </div>

      <hr className="mb-8 border-g-divider" />

      <div className="mb-8" />
    </div>
  );
};

const Selector = ({ weaknesses, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <CreatableSelect
        className="basic-multi-select"
        placeholder="Search weaknesses by keyword"
        components={{ MenuList: WindowedMenuList }}
        isMulti
        value={weaknesses}
        options={options}
        classNamePrefix="select"
        onChange={onChange}
        id="long-value-select"
        instanceId="long-value-select"
      />
      <div
        className={`flex text-xs ${
          weaknesses?.length >= 3 && weaknesses?.length < 10
            ? "text-g-error-red"
            : "text-g-text-light-grey"
        }`}
      >
        {weaknesses?.length ?? 0}/10
      </div>
    </div>
  );
};


export default Weaknesses;
