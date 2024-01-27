import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BaseProps } from "../components/types";
import { Appointment } from "../models/appointments";
import * as UserCoursesApi from "../apis/user_courses_api";
import { useAppContext } from ".";
import { Course } from "../models/course";

type PurchasedPackagesContextType = {
  purchasedPackages?: Course[];
  getAllPurchasedPackages: () => Promise<void>;
};

const initialContext: PurchasedPackagesContextType = {
  purchasedPackages: null,
  getAllPurchasedPackages: async () => {},
};

const PurchasedPackagesContext = createContext(initialContext);

export const usePurchasedPackagesContext = () =>
  useContext(PurchasedPackagesContext);

const PurchasedPackagesProvider = ({ children }: BaseProps) => {
  const { user } = useAppContext();

  const [purchasedPackages, setPurchasedPackages] = useState<Course[]>(null);

  useEffect(() => {
    //console.log("PurchasedPackagesContext,useEffect. User: ", user);
    if (user) {
      getAllPurchasedPackages();
    } else {
      clearPurchasedPackages();
    }
  }, [user]);

  const getAllPurchasedPackages = async () => {
    //console.log("getAllPurchasedPackages");
    await UserCoursesApi.getUserCourses()({
      onSuccess: ({ data }) => {
        setPurchasedPackages(data);
      },
    });
  };

  const clearPurchasedPackages = async () => {
    //console.log("clearPurchasedPackages");
    setPurchasedPackages(null);
  };

  const value = {
    purchasedPackages,
    getAllPurchasedPackages,
  };
  return (
    <PurchasedPackagesContext.Provider value={value}>
      {children}
    </PurchasedPackagesContext.Provider>
  );
};

export default PurchasedPackagesProvider;
