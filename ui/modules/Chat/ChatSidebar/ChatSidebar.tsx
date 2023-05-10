"use client";

import { useFeatureToggleContext } from "#/lib/contexts/FeatureToggleContext";
import {useSettingsContext} from "#/lib/contexts/SettingsContext";
import { inProdEnv } from "#/lib/helpers/env-helpers";
import { getBotAvatar } from "#/lib/helpers/url-helpers";
import { Bot } from "#/lib/types/cms";
import Duo from "#/ui/_base/Duo/Duo";
import Collapsible from "#/ui/atoms/containers/Collapsible/Collapsible";
import ChatAssumptions from "#/ui/modules/Chat/ChatAssumptions/ChatAssumptions";
import ChatBots from "#/ui/modules/Chat/ChatBots/ChatBots";
import ChatConversations from "#/ui/modules/Chat/ChatConversations/ChatConversations";
import ChatMessageAvatar from "#/ui/modules/Chat/ChatMessageAvatar/ChatMessageAvatar";
import ChatSettings from "#/ui/modules/Chat/ChatSettings/ChatSettings";
import ChatSidebarSection from "#/ui/modules/Chat/ChatSidebarSection/ChatSidebarSection";
import ChatStats from "#/ui/modules/Chat/ChatStats/ChatStats";
import ChatSuggestions from "#/ui/modules/Chat/ChatSuggestions/ChatSuggestions";
import Footer from "#/ui/molecules/Footer/Footer";
import clsx from "clsx";
import { FC } from "react";

type ChatSidebarProps = {
  bots: Bot[];
  selectedBot: Bot;
  botIsTalking?: boolean;
};

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { bots, selectedBot, botIsTalking } = props;
  const { features } = useFeatureToggleContext();
  const { settings } = useSettingsContext();
  const botOptions = bots.filter(
    (bot) => (inProdEnv ? bot.is_featured : true) && bot.slug !== selectedBot.slug,
  );

  const disableBotMenu = botOptions?.length <= 1
  const headerStyles = clsx(
    "flex dark:border-slate-800/75 flex-shrink-0 items-center space-x-4 p-4 font-medium",
    !disableBotMenu && "hover:bg-white/50 dark:hover:bg-black/10"
  )

  const sidebarHeader = (
    <>
      <ChatMessageAvatar
        loading={!selectedBot}
        avatarUrl={selectedBot ? getBotAvatar(selectedBot) : undefined}
        role={"assistant"}
        isTalking={botIsTalking}
      />
      <Duo vertical gap="none" className="pr-2">
        <h2 className="mb-1 sm:text-md text-md dark:text-white">{selectedBot.name}</h2>
        <small className="font-normal text-secondary-content/75 dark:text-primary-content leading-normal">
          {selectedBot.description}
        </small>
      </Duo>
    </>
  );

  return (
    <>
      <Collapsible
        as="header"
        title={sidebarHeader}
        titleClassName={headerStyles}
        slug="botSelect"
        disabled={ disableBotMenu }
      >
        <ChatBots bots={botOptions} className="rounded-sm bg-white/50 p-0 dark:bg-black/10" />
      </Collapsible>

      <ChatSidebarSection
        title="Conversations"
        section="conversations"
        className="mb-auto"
        shrinkable
        fillHeight
      >
        <ChatConversations />
      </ChatSidebarSection>

      {features.showTokens && (
        <ChatSidebarSection title="Stats" section="stats">
          <ChatStats />
        </ChatSidebarSection>
      )}

      {features.enableAssumptions && (
        <ChatSidebarSection title="About You" section="assumptions">
          <ChatAssumptions />
        </ChatSidebarSection>
      )}

      {settings.enableSuggestions && (
        <ChatSidebarSection title="Suggested Questions" section="suggestions">
          <ChatSuggestions />
        </ChatSidebarSection>
      )}

      <ChatSidebarSection title="Settings" section="settings">
        <ChatSettings />
      </ChatSidebarSection>
      <Footer className="ml-4 mt-2"/>
    </>
  );
};

export default ChatSidebar;
