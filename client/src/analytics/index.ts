import type ReactGTMModule from 'react-gtm-module';

import {
  devAnalyticsId,
  prodAnalyticsId
} from '../../config/analytics-settings';

import envData from '../../config/env.json';
import { isLocalMode } from '../../config/runtime-mode';

const { deploymentEnv } = envData;

export const analyticsIDSelector = (environment = deploymentEnv) => {
  if (environment === 'staging') return devAnalyticsId;
  else return prodAnalyticsId;
};

const gtmId = analyticsIDSelector();
type TagManager = typeof ReactGTMModule;
let activeTagManager: TagManager | null = null;

async function initializeAnalytics(): Promise<void> {
  const { default: tagManager } = await import('react-gtm-module');
  tagManager.initialize({ gtmId });
  activeTagManager = tagManager;
}

if (typeof document !== 'undefined' && !isLocalMode()) {
  void initializeAnalytics().catch(() => undefined);
}

const analytics: Pick<TagManager, 'dataLayer'> = {
  dataLayer(args) {
    activeTagManager?.dataLayer(args);
  }
};

export default analytics;
