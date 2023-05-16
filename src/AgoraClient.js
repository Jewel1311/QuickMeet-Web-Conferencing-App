import AgoraRTC from 'agora-rtc-sdk-ng';

// initialize the agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export { client };