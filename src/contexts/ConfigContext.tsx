import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import baseConfig from '../config/config.json';
import healthcareConfig from '../config/healthcare.json';

// Define the configuration structure
export interface Config {
  appName: string;
  industry?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  logo: {
    main: string;
    small: string;
  };
  menuItems: Array<{
    id: string;
    label: string;
    icon: string;
    path: string;
    requiredScope: string;
  }>;
  dashboardWidgets: Array<{
    id: string;
    title: string;
    type: string;
    requiredScope?: string;
    data?: any;
  }>;
  texts: {
    welcomeMessage: string;
    dashboardTitle: string;
    loginTitle: string;
    [key: string]: string;
  };
}

interface ConfigContextType {
  config: Config;
  setIndustry: (industry: string) => void;
  updateTheme: (primaryColor: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<Config>(baseConfig);
  const [industry, setIndustry] = useState<string>('healthcare');

  // Load industry-specific configuration
  useEffect(() => {
    if (industry === 'healthcare') {
      // Deep merge the base config with the healthcare config
      setConfig(mergeConfigs(baseConfig, healthcareConfig));
    } else {
      setConfig(baseConfig);
    }
  }, [industry]);

  // Function to merge configurations
  const mergeConfigs = (base: Config, override: Partial<Config>): Config => {
    return {
      ...base,
      ...override,
      theme: { ...base.theme, ...(override.theme || {}) },
      logo: { ...base.logo, ...(override.logo || {}) },
      texts: { ...base.texts, ...(override.texts || {}) },
      // For arrays, we use the override if provided, otherwise the base
      menuItems: override.menuItems || base.menuItems,
      dashboardWidgets: override.dashboardWidgets || base.dashboardWidgets,
    };
  };

  // Function to update theme with organization branding
  const updateTheme = (primaryColor: string) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      theme: {
        ...prevConfig.theme,
        primaryColor,
      },
    }));
  };

  return (
    <ConfigContext.Provider value={{ config, setIndustry, updateTheme }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the config context
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
