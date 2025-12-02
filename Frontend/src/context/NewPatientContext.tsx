
import React, { createContext, useState, useContext } from 'react';

interface PatientFormState {
  name: string;
  age: string;
  images: string[];
}

interface NewPatientContextType {
  formData: PatientFormState;
  setFormData: React.Dispatch<React.SetStateAction<PatientFormState>>;
}

const NewPatientContext = createContext<NewPatientContextType | undefined>(undefined);

export const NewPatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<PatientFormState>({
    name: '',
    age: '',
    images: [],
  });

  return (
    <NewPatientContext.Provider value={{ formData, setFormData }}>
      {children}
    </NewPatientContext.Provider>
  );
};

export const useNewPatient = () => {
  const context = useContext(NewPatientContext);
  if (context === undefined) {
    throw new Error('useNewPatient must be used within a NewPatientProvider');
  }
  return context;
};
