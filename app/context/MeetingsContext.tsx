import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BaseProps } from "../components/types";
import { Appointment } from "../models/appointments";
import * as AppointmentsApi from "../apis/appointments_api";
import { useAppContext } from ".";
import { MeetingCardType } from "../components/cards/MeetingCard";

type MeetingsContextType = {
  learnerMeetings?: Appointment[];
  coachMeetings?: Appointment[];
  getAllMeetings: () => void;
  getMeetingById: (id: string, type?: MeetingCardType) => Appointment;
};

const initialContext: MeetingsContextType = {
  learnerMeetings: null,
  coachMeetings: null,
  getAllMeetings: () => {},
  getMeetingById: () => null,
};

const MeetingsContext = createContext(initialContext);

export const useMeetingsContext = () => useContext(MeetingsContext);

const MeetingsProvider = ({ children }: BaseProps) => {
  const { user } = useAppContext();

  const [learnerMeetings, setLearnerMeetings] = useState<Appointment[]>(null);
  const [coachMeetings, setCoachMeetings] = useState<Appointment[]>(null);

  useEffect(() => {
    //console.log("MeetingsContext,useEffect. User: ", user);
    if (user) {
      getAllMeetings();
    } else {
      clearMeetings();
    }
  }, [user]);

  const getAllMeetings = async () => {
    //console.log("getAllMeetings");
    const response = await AppointmentsApi.getAllMeetings();

    setLearnerMeetings(response.learnerMeetings);
    setCoachMeetings(response.coachMeetings);
  };

  /**
   * Helper method for finding a meeting.
   */
  const getMeetingById = (id: string, type?: MeetingCardType) => {
    let meetings = coachMeetings;
    if (type) {
      if (type === "learner") {
        meetings = learnerMeetings;
      }
    } else {
      meetings = coachMeetings?.concat(learnerMeetings);
    }

    return meetings?.find((m) => m._id === id);
  };

  const clearMeetings = async () => {
    //console.log("clearMeetings");
    setLearnerMeetings(null);
    setCoachMeetings(null);
  };

  const value = {
    learnerMeetings,
    coachMeetings,
    getAllMeetings,
    getMeetingById,
  };
  return (
    <MeetingsContext.Provider value={value}>
      {children}
    </MeetingsContext.Provider>
  );
};

export default MeetingsProvider;
