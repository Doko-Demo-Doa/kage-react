import { ChimeJoinInfo } from '~/typings/types';
import { fetchRetry } from '../helper';

export const apiChime = {
  getMeetingPayload: async (
    meetingId: string,
    attendeeName: string,
    region?: string,
  ): Promise<ChimeJoinInfo> => {
    const r = fetchRetry(
      `${
        process.env.CHIME_SERVER
      }/join?title=${meetingId}&name=${attendeeName}&region=${
        region || process.env.CHIME_DEFAULT_REGION
      }`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    return (await r).json();
  },

  getNearestMediaRegion: async (): Promise<string> => {
    try {
      const r = fetchRetry('https://nearest-media-region.l.chime.aws/');
      return (await (await r).json()).region;
    } catch (_) {
      console.log(_);
      return process.env.CHIME_DEFAULT_REGION || 'us';
    }
  },
};
