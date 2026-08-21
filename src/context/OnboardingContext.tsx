import { getData } from "@/store/getData";
import { notifyMessage } from "@/utils/utils";
import { createContext, FC, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const OnboardingContext = createContext<any>(null);

const OnboardingContextProvider: FC<Props> = ({ children }) => {
  const [onboarded, setOnboarded] = useState<boolean>(false)
  const [loadedOnboarding, setLoad] = useState<boolean>(false)

  useEffect(() => {
    async function getStoredData() {
      try {
        const onboard = await getData('onboarded')
        setOnboarded(onboard ?  onboard : false)
      }
      catch (e) {
        notifyMessage('Ошибка при загрузке приветсвия приложения. Переоткройте приложение.')
      }
      finally {
        setLoad(true)
      }
    }
    getStoredData()
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        onboarded,
        setOnboarded,
        loadedOnboarding
      }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export {
  OnboardingContext,
  OnboardingContextProvider
};

