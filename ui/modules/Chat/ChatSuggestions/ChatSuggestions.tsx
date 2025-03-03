"use client";
import { DEBUG_SUGGESTIONS } from "#/app/chat/lib/constants";
import { createChatMessage } from "#/app/chat/lib/helpers/chat-helpers";
import { useChatContext } from "#/lib/contexts/ChatContext";
import { useFeatureToggleContext } from "#/lib/contexts/FeatureToggleContext";
import Spinner from "#/ui/atoms/svgs/Spinner";
import clsx from "clsx";
import styles from "./ChatSuggestions.module.scss";
import {useSettingsContext} from "#/lib/contexts/SettingsContext";

type ChatSuggestionsProps = {
  className?: string;
};

export const ChatSuggestions = ({ className }: ChatSuggestionsProps) => {
  const {
    appActions: { submitQuery },
    appState: { selectedConversation, loading, suggestions, suggestionsLoading },
  } = useChatContext();
  const {settings} = useSettingsContext();
  const chatLog = selectedConversation?.messages;
  const { features } = useFeatureToggleContext();

  const displaySuggestions = !!features.debugMode
    ? [...(suggestions || []), ...DEBUG_SUGGESTIONS]
    : suggestions;

  if (!displaySuggestions || displaySuggestions === null || !settings.enableSuggestions ||(chatLog && chatLog.length < 3)) {
    return null;
  }

  return (
    <div className={clsx(styles.root, className)}>
      {loading || suggestionsLoading ? (
        <div className="relative -top-2 ml-2 text-blue-400 md:m-4 md:ml-2">
          <Spinner />
        </div>
      ) : (
        <>
          <ul className="space-y-2 p-0 peer-checked:text-secondary-content">
            {displaySuggestions !== null &&
              displaySuggestions.map((prompt, index) => (
                <li key={index} className="w-full">
                  <button
                    type="submit"
                    className="text-left text-blue-600"
                    title={"Ask: '" + prompt + "'"}
                    onClick={(e) => submitQuery(createChatMessage("user", prompt))}
                  >
                    {prompt}
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ChatSuggestions;
