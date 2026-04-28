import { env } from '@/shared/config/env';
import { type PostComment } from '@/features/comments/model/types';

type PostLikeUpdatedEvent = {
  type: 'like_updated';
  postId: string;
  likesCount: number;
};

type PostCommentAddedEvent = {
  type: 'comment_added';
  postId: string;
  comment: PostComment;
};

type PostPingEvent = {
  type: 'ping';
};

type PostEventsMessage = PostLikeUpdatedEvent | PostCommentAddedEvent | PostPingEvent;

type PostEventHandlers = {
  onLikeUpdated: (event: PostLikeUpdatedEvent) => void;
  onCommentAdded: (event: PostCommentAddedEvent) => void;
};

type PostEventUnsubscribe = () => void;

const RECONNECT_DELAYS_MS = [1_000, 2_000, 5_000, 10_000] as const;

function buildPostEventsWsUrl() {
  const wsBase = env.apiBaseUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
  return `${wsBase}/ws?token=${encodeURIComponent(env.authToken)}`;
}

class PostEventsSocket {
  private readonly handlersByPost = new Map<string, Set<PostEventHandlers>>();
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;

  subscribe(postId: string, handlers: PostEventHandlers): PostEventUnsubscribe {
    const bucket = this.handlersByPost.get(postId) ?? new Set<PostEventHandlers>();
    bucket.add(handlers);
    this.handlersByPost.set(postId, bucket);

    this.ensureConnected();

    return () => {
      const currentBucket = this.handlersByPost.get(postId);
      if (!currentBucket) {
        return;
      }

      currentBucket.delete(handlers);
      if (currentBucket.size === 0) {
        this.handlersByPost.delete(postId);
      }

      if (this.handlersByPost.size === 0) {
        this.disconnect();
      }
    };
  }

  private ensureConnected() {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    this.manuallyClosed = false;
    this.connect();
  }

  private connect() {
    const socket = new WebSocket(buildPostEventsWsUrl());
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
    };

    socket.onmessage = (message) => {
      const payload = this.parseMessage(message.data);
      if (!payload || payload.type === 'ping') {
        return;
      }

      const handlers = this.handlersByPost.get(payload.postId);
      if (!handlers || handlers.size === 0) {
        return;
      }

      handlers.forEach((handler) => {
        if (payload.type === 'like_updated') {
          handler.onLikeUpdated(payload);
          return;
        }

        handler.onCommentAdded(payload);
      });
    };

    socket.onclose = () => {
      this.socket = null;

      if (!this.manuallyClosed && this.handlersByPost.size > 0) {
        this.scheduleReconnect();
      }
    };

    socket.onerror = () => {
      // onclose handles reconnect logic.
    };
  }

  private disconnect() {
    this.manuallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }

    const delay = RECONNECT_DELAYS_MS[Math.min(this.reconnectAttempts, RECONNECT_DELAYS_MS.length - 1)];
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private parseMessage(rawData: unknown): PostEventsMessage | null {
    if (typeof rawData !== 'string') {
      return null;
    }

    try {
      const parsed = JSON.parse(rawData) as PostEventsMessage;
      if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}

const postEventsSocket = new PostEventsSocket();

export function subscribeToPostEvents(postId: string, handlers: PostEventHandlers) {
  return postEventsSocket.subscribe(postId, handlers);
}
