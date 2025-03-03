"use client";

import { createChatMessage } from "#/app/chat/lib/helpers/chat-helpers";
import { GptRole, StatusChatMessage } from "#/app/chat/lib/types";
import { useChatContext } from "#/lib/contexts/ChatContext";
import { useFeatureToggleContext } from "#/lib/contexts/FeatureToggleContext";
import { getMediaUrl } from "#/lib/helpers/url-helpers";
import BaseButton from "#/ui/_base/BaseButton/BaseButton";
import Duo from "#/ui/_base/Duo/Duo";
import ChatSpeakButton from "#/ui/atoms/buttons/ChatSpeakButton/ChatSpeakButton";
import CopyButton from "#/ui/atoms/buttons/CopyButton/CopyButton";
import Timestamp from "#/ui/atoms/decorations/Timestamp/Timestamp";
import ChatMessageAvatar from "#/ui/modules/Chat/ChatMessageAvatar/ChatMessageAvatar";
import { ChatMessageEdit } from "#/ui/modules/Chat/ChatMessageEdit/ChatMessageEdit";
import ParsedMarkdown2 from "#/ui/molecules/ParsedMarkdown/ParsedMarkdown";
import { ArrowPathRoundedSquareIcon, PencilIcon, StopIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import styles from "./ChatMessage.module.scss";
import Spinner from "#/ui/atoms/svgs/Spinner";
import LoadingDots from "#/ui/atoms/decorations/LoadingDots/LoadingDots";

type ChatMessageProps = Omit<StatusChatMessage, "role" | "content"> & {
  content?: string;
  role?: GptRole;
  avatarUrl?: string;
  /**
   * Display a loading indicator in the chat message.
   */
  isTalking?: boolean;
  /**
   * The server time passed to the first message in the chat log.
   */
  time?: string;
  /**
   * The index of this messages in the context of the conversation
   * Used to edit the message
   */
  messageIndex?: number;
  className?: string;
  onRegenerate?: () => void;
  onStop?: () => void;
};

export const ChatMessage = (props: ChatMessageProps) => {
  const { features } = useFeatureToggleContext();
  const {
    dataState: { bot },
    appState: { loading },
  } = useChatContext();
  const speechContext = useSpeechSynthesis();
  const { speaking, cancel } = speechContext;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const avatarUrl = !!bot?.avatar?.data ? getMediaUrl(bot.avatar.data.attributes.url) : undefined;

  const { content, role, tokens, isTalking, time, className, messageIndex, onRegenerate, onStop } =
    props;

  const isUser = role === "user";
  const isSystem = role === "system";

  const rootStyles = clsx(
    styles.root,
    "chat m-0 p-4 pb-0",
    isUser ? [styles.alignRight, "chat-end"] : "chat-start",
    className,
  );

  const bubbleStyles = clsx(
    styles.chatBubble,
    `chat-bubble flex max-w-full flex-col transition pb-1`,
    isUser ? "bg-blue-50 dark:bg-slate-900/50" : "bg-neutral-50 dark:bg-black/25",
  );

  const contentStyles = clsx(isSystem && "text-orange-500 text-xs max-w-full");

  const buttonStyles = isUser ? "text-left" : "text-right";

  const editButton = isUser && (
    <>
      <BaseButton
        className="mr-2 text-xs"
        flavor="bare"
        text="Edit"
        size="sm"
        onClick={() => setIsEditing(true)}
        theme="secondary"
      />
      <small className="mr-2 text-xs text-neutral-300">|</small>
    </>
  );

  const regenerateButton = onRegenerate && !isUser && !isSystem && (
    <>
      <BaseButton
        flavor="bare"
        theme="secondary"
        title="Regenerate response"
        text="Regenerate"
        size="sm"
        onClick={onRegenerate}
        className="mx-2 text-xs"
      />
      <small className="mr-2 text-xs text-neutral-300">|</small>
    </>
  );

  const stopButton = onStop && loading && (
    <>
      <small className="text-xs text-neutral-400">|</small>
      <BaseButton
        flavor="icon"
        icon={<StopIcon />}
        onClick={onStop}
        text="Stop Generating"
        title="Stop generating a response"
        size="sm"
        className="gap-0 text-xs flex"
      />
    </>
  );

  const handleAvatarClick = () => {
    speaking && cancel();
    speaking && onStop && onStop();
  };

  const innerMessage = !content ? <LoadingDots className="relative top-2" /> : (
    isEditing && messageIndex ? (
      <ChatMessageEdit
        message={createChatMessage("user", content)}
        messageIndex={messageIndex}
        setEditModeOff={() => setIsEditing(false)}
      />
    ) : (
      <>
        <ParsedMarkdown2 content={content} className={contentStyles} />
        <Duo
          gap="full"
          centered
          className={clsx(
            "transition-hover",
            isHovering || speaking || !!onRegenerate ? "opacity-1" : "sm:opacity-0",
          )}
        >
          <ChatSpeakButton text={content} {...speechContext} className="-ml-1" />
          <div className="flex">
            {editButton || regenerateButton}
            <CopyButton content={content} className={buttonStyles} />
          </div>
        </Duo>
      </>
    )
  )

  return (
    <li
      className={rootStyles}
      dir="ltr"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {((features.showUserAvatar && role === "user") ||
        (features.showBotAvatar && role === "assistant")) && (
        <ChatMessageAvatar
          avatarUrl={avatarUrl}
          isTalking={isTalking || speaking}
          role={role}
          className={clsx("mt-5 hidden md:block", speaking && "cursor-pointer")}
          onClick={speaking ? handleAvatarClick : undefined}
        />
      )}
      <div className="chat-header flex space-x-1">
        <Timestamp time={time} className="mb-1 ml-3.5" />
        {features.showTokens && tokens && (
          <>
            <small className="text-xs text-neutral-400">|</small>
            <small className="text-xs text-orange-500">{tokens} Tokens</small>
          </>
        )}
        {stopButton}
      </div>
      <div className={bubbleStyles}>
        {innerMessage}
      </div>
    </li>
  );
};
export default ChatMessage;
