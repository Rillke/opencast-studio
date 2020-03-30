export async function startAudioCapture(dispatch, deviceId = null) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId ? { deviceId } : true,
      video: false
    });
    stream.getTracks().forEach(track => {
      track.onended = () => {
        dispatch({ type: 'UNSHARE_AUDIO' });
      };
    });

    dispatch({ type: 'SHARE_AUDIO', payload: stream });
    return true;
  } catch (err) {
    // TODO: there several types of exceptions; certainly we should differentiate here one day
    console.error('Error: ' + err);

    dispatch({ type: 'BLOCK_AUDIO' });
    return false;
  }
}

export async function startDisplayCapture(dispatch, settings) {
  const maxFps = settings.display?.maxFps
    ? { frameRate: { max: settings.display.maxFps } }
    : {};
  const maxHeight = settings.display?.maxHeight
    ? { height: { max: settings.display.maxHeight } }
    : {};

  const constraints = {
    video: {
      cursor: 'always',
      ...maxFps,
      ...maxHeight,
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    stream.getTracks().forEach(track => {
      track.onended = () => {
        dispatch({ type: 'UNSHARE_DISPLAY' });
      };
    });

    dispatch({ type: 'SHARE_DISPLAY', payload: stream });
  } catch (err) {
    // TODO: there 7 types of exceptions; certainly we should differentiate here one day
    console.error('Error: ' + err);

    dispatch({ type: 'BLOCK_DISPLAY' });
  }
}

export async function startUserCapture(dispatch, settings) {
  const maxFps = settings.camera?.maxFps
    ? { frameRate: { max: settings.camera.maxFps } }
    : {};
  const maxHeight = settings.camera?.maxHeight
    ? { height: { ideal: Math.min(1080, settings.camera.maxHeight), max: settings.camera.maxHeight } }
    : { height: { ideal: 1080 } };

  const constraints = {
    video: {
      facingMode: 'user',
      ...maxFps,
      ...maxHeight,
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach(track => {
      track.onended = () => {
        dispatch({ type: 'UNSHARE_USER' });
      };
    });
    dispatch({ type: 'SHARE_USER', payload: stream });
  } catch (err) {
    // TODO: there 7 types of exceptions; certainly we should differentiate here one day
    console.error('Error: ' + err);

    dispatch({ type: 'BLOCK_USER' });
  }
}

// ----------------------------------------------------------------------------

export function stopCapture({ audioStream, displayStream, userStream }, dispatch) {
  stopAudioCapture(audioStream, dispatch);
  stopDisplayCapture(displayStream, dispatch);
  stopUserCapture(userStream, dispatch);
}

export function stopAudioCapture(stream, dispatch) {
  stream && stream.getTracks().forEach(track => track.stop());
  dispatch({ type: 'UNSHARE_AUDIO' });
}

export function stopDisplayCapture(stream, dispatch) {
  stream && stream.getTracks().forEach(track => track.stop());
  dispatch({ type: 'UNSHARE_DISPLAY' });
}

export function stopUserCapture(stream, dispatch) {
  stream && stream.getTracks().forEach(track => track.stop());
  dispatch({ type: 'UNSHARE_USER' });
}