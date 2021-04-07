export type LoginResponseType = {
  user_id: number
};

export interface AttendeeType {
  AttendeeId: string
  ExternalUserId: string
  JoinToken: string
}

export interface MeetingType {
  ExternalMeetingId: string
  MediaRegion: string
  MeetingId: string
  MediaPlacement: MediaPlacementType
}

export interface MediaPlacementType {
  AudioFallbackUrl: string
  AudioHostUrl: string
  ScreenDataUrl: string
  ScreenSharingUrl: string
  ScreenViewingUrl: string
  SignalingUrl: string
  TurnControlUrl: string
}

export interface ChimeJoinInfo {
  JoinInfo: {
    Attendee: {
      Attendee: AttendeeType
    }
    Meeting: {
      Meeting: MeetingType
    }
  }
  error?: string
}
