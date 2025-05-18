import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/schema/user";

export default function CardProfile({ user }: { user: User }) {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
            />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <Badge
              variant={user.role === "Admin" ? "destructive" : "default"}
              className="mt-1"
            >
              {user.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Email:</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">WhatsApp:</p>
            <p className="font-medium">{user.whatsapp || "Not Set"}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Member Since:</p>
            <p className="font-medium">
              {new Date(user.createdAt!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
