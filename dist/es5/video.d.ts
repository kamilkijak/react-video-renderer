import * as React from 'react';
import { Component, ReactElement, ReactNode, SyntheticEvent, RefObject } from 'react';
export declare type VideoStatus = 'playing' | 'paused' | 'errored';
export declare type VideoError = MediaError | null;
export interface VideoState {
    status: VideoStatus;
    currentTime: number;
    volume: number;
    duration: number;
    buffered: number;
    isMuted: boolean;
    isLoading: boolean;
    error?: VideoError;
}
export declare type NavigateFunction = (time: number) => void;
export declare type SetVolumeFunction = (volume: number) => void;
export declare type SetPlaybackSpeed = (volume: number) => void;
export interface VideoActions {
    play: () => void;
    pause: () => void;
    navigate: NavigateFunction;
    setVolume: SetVolumeFunction;
    setPlaybackSpeed: SetPlaybackSpeed;
    requestFullscreen: () => void;
    mute: () => void;
    unmute: () => void;
    toggleMute: () => void;
}
export declare type RenderCallback = (videoElement: ReactElement<SourceElement>, state: VideoState, actions: VideoActions, ref: RefObject<SourceElement>) => ReactNode;
export interface VideoProps {
    src: string;
    children: RenderCallback;
    defaultTime: number;
    sourceType: 'video' | 'audio';
    controls: boolean;
    autoPlay: boolean;
    preload: string;
    poster?: string;
    crossOrigin?: string;
    subtitlesSrc?: string;
    onCanPlay?: (event: SyntheticEvent<SourceElement>) => void;
    onError?: (event: SyntheticEvent<SourceElement>) => void;
    onTimeChange?: (time: number, duration: number) => void;
}
export interface VideoComponentState {
    currentTime: number;
    volume: number;
    status: VideoStatus;
    duration: number;
    buffered: number;
    isMuted: boolean;
    isLoading: boolean;
    error?: VideoError;
}
export declare type SourceElement = HTMLVideoElement | HTMLAudioElement;
export declare class Video extends Component<VideoProps, VideoComponentState> {
    previousVolume: number;
    previousTime: number;
    videoRef: RefObject<HTMLVideoElement>;
    audioRef: RefObject<HTMLAudioElement>;
    hasCanPlayTriggered: boolean;
    state: VideoComponentState;
    static defaultProps: {
        defaultTime: number;
        sourceType: string;
        autoPlay: boolean;
        controls: boolean;
        preload: string;
    };
    onLoadedData: () => void;
    componentDidUpdate(prevProps: VideoProps): void;
    private onVolumeChange;
    private onTimeUpdate;
    private onCanPlay;
    private onPlay;
    private onPause;
    private get videoState();
    private play;
    private pause;
    private navigate;
    private setVolume;
    private setPlaybackSpeed;
    private get currentElement();
    private requestFullscreen;
    private mute;
    private unmute;
    private toggleMute;
    private get actions();
    private onDurationChange;
    private onError;
    private onWaiting;
    render(): React.ReactNode;
}
