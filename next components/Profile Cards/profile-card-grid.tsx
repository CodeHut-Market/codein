"use client"

import { useState } from "react"
import { PlusCircle, Star, Bell, Search, MessageCircle, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
}

const profiles: ProfileCardProps[] = [
  {
    name: "Alex Thompson",
    role: "UI/UX Designer",
    status: "online",
    avatar: "/memoji-alex.png",
    tags: ["Premium"],
    isVerified: true,
    followers: 1240,
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer",
    status: "online",
    avatar: "/memoji-michael.png",
    tags: ["Guest"],
    isVerified: false,
    followers: 856,
  },
  {
    name: "Emily Wilson",
    role: "Product Manager",
    status: "away",
    avatar: "/memoji-emily.png",
    tags: ["Premium"],
    isVerified: true,
    followers: 2100,
  },
  {
    name: "David Rodriguez",
    role: "Marketing Specialist",
    status: "offline",
    avatar: "/memoji-david.png",
    tags: ["Guest"],
    isVerified: false,
    followers: 432,
  },
]

export default function ProfileCardGrid() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const filteredProfiles = selectedFilter
    ? profiles.filter((profile) => profile.tags?.includes(selectedFilter))
    : profiles

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Team Members</h1>
            <p className="mt-2 text-gray-600">Connect with your colleagues</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-white p-3 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)]">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-full bg-white p-3 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)]">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedFilter(null)}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
              !selectedFilter
                ? "bg-white text-gray-800 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]"
                : "bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]",
            )}
          >
            All Members
          </button>
          <button
            onClick={() => setSelectedFilter("Premium")}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
              selectedFilter === "Premium"
                ? "bg-white text-blue-600 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]"
                : "bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]",
            )}
          >
            Premium
          </button>
          <button
            onClick={() => setSelectedFilter("Guest")}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
              selectedFilter === "Guest"
                ? "bg-white text-blue-600 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]"
                : "bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]",
            )}
          >
            Guests
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
          <AddProfileCard />
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ name, role, status, avatar, tags = [], isVerified, followers }: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)]">
      {/* Status indicator */}
      <div className="absolute right-4 top-4">
        <div
          className={cn(
            "h-3 w-3 rounded-full border border-white",
            status === "online" ? "bg-green-500" : status === "away" ? "bg-amber-500" : "bg-gray-400",
          )}
        ></div>
      </div>

      {/* Verified badge */}
      {isVerified && (
        <div className="absolute right-4 top-10">
          <div className="rounded-full bg-blue-500 p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-white p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]">
            <img src={avatar || "/placeholder.svg"} alt={name} className="h-full w-full rounded-full object-contain" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{role}</p>

        {followers && <p className="mt-2 text-xs text-gray-400">{followers.toLocaleString()} followers</p>}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-4 flex justify-center gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "inline-block rounded-full bg-white px-3 py-1 text-xs font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)]",
                tag === "Premium" ? "text-blue-600" : "text-gray-600",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-2">
        <button className="flex-1 rounded-full bg-white py-2 text-sm font-medium text-blue-600 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)]">
          <UserPlus className="mx-auto h-4 w-4" />
        </button>
        <button className="flex-1 rounded-full bg-white py-2 text-sm font-medium text-gray-700 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)]">
          <MessageCircle className="mx-auto h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function AddProfileCard() {
  return (
    <div className="flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all hover:shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.8)]">
      <div className="mb-4 rounded-full bg-white p-4 shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.8)]">
        <PlusCircle className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Add New Member</h3>
      <p className="text-sm text-gray-500">Invite someone to join your team</p>
    </div>
  )
}
