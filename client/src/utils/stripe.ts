import type { Stripe } from '@stripe/stripe-js';

import envData from '../../config/env.json';
import { isLocalMode } from '../../config/runtime-mode';

const stripePublicKey = envData.stripePublicKey as string | null;

export const stripe: PromiseLike<Stripe | null> | null =
  stripePublicKey && !isLocalMode()
    ? import('@stripe/stripe-js').then(({ loadStripe }) =>
        loadStripe(stripePublicKey)
      )
    : null;
