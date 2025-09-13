import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();

  return (
    <div className="p-4 border-b border-zinc-800 backdrop-blur-2xl sticky top-0 bg-zinc-900/50 z-10">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.imageUrl} />
          <AvatarFallback>{selectedUser?.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser?.fullName}</h2>
          <p className="text-sm text-zinc-400">
            {selectedUser && onlineUsers.has(selectedUser.clerkId)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
