import { __assign, __extends } from "tslib";
import * as React from 'react';
import { Component } from 'react';
import { requestFullScreen } from './utils';
var getVolumeFromVideo = function (video) {
    var volume = video.volume;
    var isMuted = volume === 0;
    return {
        volume: volume,
        isMuted: isMuted
    };
};
var isSafari = typeof navigator !== 'undefined' ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
var Video = /** @class */ (function (_super) {
    __extends(Video, _super);
    function Video() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.previousVolume = 1;
        _this.previousTime = -1;
        _this.videoRef = React.createRef();
        _this.audioRef = React.createRef();
        _this.hasCanPlayTriggered = false;
        _this.state = {
            isLoading: true,
            buffered: 0,
            currentTime: 0,
            volume: 1,
            status: 'paused',
            duration: 0,
            isMuted: false
        };
        _this.onLoadedData = function () {
            var defaultTime = _this.props.defaultTime;
            if (_this.currentElement) {
                _this.currentElement.currentTime = defaultTime;
            }
        };
        _this.onVolumeChange = function (event) {
            var video = event.target;
            var _a = getVolumeFromVideo(video), volume = _a.volume, isMuted = _a.isMuted;
            _this.setState({
                volume: volume,
                isMuted: isMuted
            });
        };
        _this.onTimeUpdate = function (event) {
            var video = event.target;
            var onTimeChange = _this.props.onTimeChange;
            var duration = _this.state.duration;
            var flooredTime = Math.floor(video.currentTime);
            if (onTimeChange && flooredTime !== _this.previousTime) {
                onTimeChange(flooredTime, duration);
                _this.previousTime = flooredTime;
            }
            _this.setState({
                currentTime: video.currentTime
            });
            if (video.buffered.length) {
                var buffered = video.buffered.end(video.buffered.length - 1);
                _this.setState({ buffered: buffered });
            }
        };
        _this.onCanPlay = function (event) {
            var onCanPlay = _this.props.onCanPlay;
            var video = event.target;
            var _a = getVolumeFromVideo(video), volume = _a.volume, isMuted = _a.isMuted;
            _this.setState({
                volume: volume,
                isMuted: isMuted,
                isLoading: false,
                currentTime: video.currentTime,
                duration: video.duration
            });
            if (!_this.hasCanPlayTriggered) {
                // protect against browser firing this event multiple times
                _this.hasCanPlayTriggered = true;
                onCanPlay && onCanPlay(event);
            }
        };
        _this.onPlay = function () {
            _this.setState({
                status: 'playing'
            });
        };
        _this.onPause = function () {
            _this.setState({
                status: 'paused'
            });
        };
        _this.play = function () {
            _this.currentElement && _this.currentElement.play();
        };
        _this.pause = function () {
            _this.currentElement && _this.currentElement.pause();
        };
        _this.navigate = function (time) {
            _this.setState({ currentTime: time });
            _this.currentElement && (_this.currentElement.currentTime = time);
        };
        _this.setVolume = function (volume) {
            _this.setState({ volume: volume });
            _this.currentElement && (_this.currentElement.volume = volume);
        };
        _this.setPlaybackSpeed = function (playbackSpeed) {
            _this.currentElement && (_this.currentElement.playbackRate = playbackSpeed);
        };
        _this.requestFullscreen = function () {
            var sourceType = _this.props.sourceType;
            if (sourceType === 'video') {
                requestFullScreen(_this.currentElement);
            }
        };
        _this.mute = function () {
            var volume = _this.state.volume;
            _this.previousVolume = volume;
            _this.setVolume(0);
        };
        _this.unmute = function () {
            _this.setVolume(_this.previousVolume);
        };
        _this.toggleMute = function () {
            var volume = _this.videoState.volume;
            if (volume > 0) {
                _this.mute();
            }
            else {
                _this.unmute();
            }
        };
        _this.onDurationChange = function (event) {
            var video = event.target;
            _this.setState({
                duration: video.duration
            });
        };
        _this.onError = function (event) {
            var onError = _this.props.onError;
            var video = event.target;
            _this.setState({
                isLoading: false,
                status: 'errored',
                error: video.error
            });
            onError && onError(event);
        };
        _this.onWaiting = function () {
            _this.setState({ isLoading: true });
        };
        return _this;
    }
    Video.prototype.componentDidUpdate = function (prevProps) {
        var src = this.props.src;
        var _a = this.state, currentTime = _a.currentTime, status = _a.status;
        var hasSrcChanged = prevProps.src !== src;
        if (hasSrcChanged) {
            this.hasCanPlayTriggered = false;
            // TODO: add test to cover this case
            if (status === 'playing') {
                this.play();
            }
            this.navigate(currentTime);
        }
    };
    Object.defineProperty(Video.prototype, "videoState", {
        get: function () {
            var _a = this.state, currentTime = _a.currentTime, volume = _a.volume, status = _a.status, duration = _a.duration, buffered = _a.buffered, isMuted = _a.isMuted, isLoading = _a.isLoading, error = _a.error;
            return {
                currentTime: currentTime,
                volume: volume,
                status: status,
                duration: duration,
                buffered: buffered,
                isMuted: isMuted,
                isLoading: isLoading,
                error: error
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Video.prototype, "currentElement", {
        get: function () {
            var sourceType = this.props.sourceType;
            if (sourceType === 'video' && this.videoRef.current) {
                return this.videoRef.current;
            }
            else if (sourceType === 'audio' && this.audioRef.current) {
                return this.audioRef.current;
            }
            else {
                return undefined;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Video.prototype, "actions", {
        get: function () {
            var _a = this, play = _a.play, pause = _a.pause, navigate = _a.navigate, setVolume = _a.setVolume, setPlaybackSpeed = _a.setPlaybackSpeed, requestFullscreen = _a.requestFullscreen, mute = _a.mute, unmute = _a.unmute, toggleMute = _a.toggleMute;
            return {
                play: play,
                pause: pause,
                navigate: navigate,
                setVolume: setVolume,
                setPlaybackSpeed: setPlaybackSpeed,
                requestFullscreen: requestFullscreen,
                mute: mute,
                unmute: unmute,
                toggleMute: toggleMute,
            };
        },
        enumerable: false,
        configurable: true
    });
    Video.prototype.render = function () {
        var _a = this, videoState = _a.videoState, actions = _a.actions;
        var _b = this.props, sourceType = _b.sourceType, poster = _b.poster, src = _b.src, children = _b.children, autoPlay = _b.autoPlay, controls = _b.controls, preload = _b.preload, crossOrigin = _b.crossOrigin, subtitlesSrc = _b.subtitlesSrc;
        var props = {
            src: src,
            preload: preload,
            controls: controls,
            autoPlay: autoPlay,
            onLoadedData: this.onLoadedData,
            onPlay: this.onPlay,
            onPause: this.onPause,
            onVolumeChange: this.onVolumeChange,
            onTimeUpdate: this.onTimeUpdate,
            onCanPlay: this.onCanPlay,
            onDurationChange: this.onDurationChange,
            onError: this.onError,
            onWaiting: this.onWaiting,
            crossOrigin: crossOrigin,
        };
        if (sourceType === 'video') {
            return children(React.createElement("video", __assign({ ref: this.videoRef, poster: poster }, props, { crossOrigin: "anonymous" }), subtitlesSrc ? React.createElement("track", { src: subtitlesSrc, kind: "subtitles" }) : null), videoState, actions, this.videoRef);
        }
        else {
            return children(React.createElement("audio", __assign({ ref: this.audioRef }, props)), videoState, actions, this.audioRef);
        }
    };
    Video.defaultProps = {
        defaultTime: 0,
        sourceType: 'video',
        autoPlay: false,
        controls: false,
        preload: isSafari ? 'auto' : 'metadata'
    };
    return Video;
}(Component));
export { Video };
