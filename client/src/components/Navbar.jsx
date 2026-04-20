import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "../DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className="h-16 bg-white dark:bg-[#020B1A] border-b fixed top-0 left-0 right-0 z-10">
      
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center h-full px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
          <h1 className="font-extrabold text-2xl">E-Learning</h1>
          </Link>
          
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </div>
          )}

          <DarkMode />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-xl">E-Learning</h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;


// ✅ Mobile Navbar inside same file
const MobileNavbar = ({ user, logoutHandler }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <SheetTitle className="text-xl font-bold">
            <Link to="/">                                  
            E-Learning
            </Link>
          </SheetTitle>
          <DarkMode />
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex flex-col space-y-4 text-lg">
          {user ? (
            <>
              <SheetClose asChild>
                <Link to="/my-learning">My Learning</Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/profile">Edit Profile</Link>
              </SheetClose>

              <SheetClose asChild>
                <span onClick={logoutHandler} className="cursor-pointer">
                  Log out
                </span>
              </SheetClose>

              {user?.role === "instructor" && (
                <SheetClose asChild>
                  <Link to="/admin/dashboard">
                    <Button className="w-full mt-4">Dashboard</Button>
                  </Link>
                </SheetClose>
              )}
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Link to="/login">Login</Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/signup">Signup</Link>
              </SheetClose>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};