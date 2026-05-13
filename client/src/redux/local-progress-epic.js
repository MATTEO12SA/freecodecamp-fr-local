import { ofType } from 'redux-observable';
import { ignoreElements, tap } from 'rxjs/operators';

import { setLocalCompletedChallenges } from '../utils/local-progress';
import { actionTypes as types } from './action-types';
import { completedChallengesSelector } from './selectors';

export default function localProgressEpic(action$, state$) {
  return action$.pipe(
    ofType(types.submitComplete),
    tap(() => {
      const completed = completedChallengesSelector(state$.value);
      setLocalCompletedChallenges(completed);
    }),
    ignoreElements()
  );
}
