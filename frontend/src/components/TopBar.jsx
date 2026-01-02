import { Search } from "lucide-react";
import avatarImg from "../assets/avatar.jpg";

const TopBar = () => {
    return (
        <div className="flex items-center justify-end mb-6 relative">
            <img src="https://ik.imagekit.io/4O4ed/Logo/Isai_Logo.png?updatedAt=1767372010806" alt="Isai Logo" className="w-24 h-24 left-0 absolute" />

            <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search songs, artists..."
                        className="w-64 pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    />
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-accent transition-colors cursor-pointer">
                    <img
                        src={avatarImg}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
