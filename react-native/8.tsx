import React, { useReducer } from "react";
import {
  CustomDateMessage,
  SendMessageButton,
  PageHeader,
  DifferentDayIndicator,
} from "./newComponents";
import { StyledContainer, SpacedSection, ChatMessages } from "./newStyles";
import { SecureWrapper } from "~customComponents";
import ChatStore, { INITIAL_CHAT_STATE, chatReducers, chatSelectors } from "./chatStore";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "~src/@types/react-navigation";
import { SceneName } from "~src/@types/SceneName";
import { Message, ChatState } from "./chatStore/reducers";
import { Platform } from "react-native";
const PlaceholderDay = () => <DifferentDayIndicator message={{ createdOn: new Date() }} />;
export type ChatRoute = RouteProp<RootStackParamList, SceneName.Chat>;
function NewChatComponent() {
  const [chatState, dispatchChatAction] = useReducer(chatReducers, INITIAL_CHAT_STATE);
  const displayedChatMessages = chatSelectors.getDisplayedMessages(chatState as ChatState);
  const fakeApiResponse = {
    data: displayedChatMessages,
    loading: false,
    error: false,
  };
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <ChatStore.Provider value={{ chatState, dispatchChatAction }}>
      <StyledContainer behavior={Platform.OS === "ios" ? "padding" : null}>
        <PageHeader />
        <SecureWrapper apiResponse={fakeApiResponse}>
          <ChatMessages
            inverted={!!fakeApiResponse.data?.length}
            data={fakeApiResponse.data}
            keyExtractor={(message: Message) => String(message._id)}
            ListFooterComponent={
              !fakeApiResponse.data && <DifferentDayIndicator message={fakeApiResponse.data[0]} />
            }
            ListEmptyComponent={<PlaceholderDay />}
            renderItem={CustomDateMessage}
          />
        </SecureWrapper>
        <SendMessageButton />
      </StyledContainer>
      <SpacedSection style={{ height: safeAreaInsets.bottom }} />
    </ChatStore.Provider>
  );
}
export default NewChatComponent;
