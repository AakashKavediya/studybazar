// components/ui/ProfileStats.jsx
"use client";

export default function ProfileStats({
  stats = [],
  onFollowersClick,
  onFollowingClick,
}) {
  // stats comes in as [{ label, value }] from ProfileHero
  // We intercept clicks on "Followers" / "Following"
  const handleClick = (label) => {
    if (label === "Followers" && onFollowersClick) {
      onFollowersClick();
    } else if (label === "Following" && onFollowingClick) {
      onFollowingClick();
    }
  };

  return (
    <div className="flex items-center gap-6 mt-5 mb-5">
      {stats.map((stat, index) => {
        const isClickable =
          (stat.label === "Followers" && !!onFollowersClick) ||
          (stat.label === "Following" && !!onFollowingClick);

        const Wrapper = isClickable ? "button" : "div";
        const wrapperProps = isClickable
          ? {
              onClick: () => handleClick(stat.label),
              type: "button",
              className:
                "flex flex-col items-start gap-0.5 group cursor-pointer",
            }
          : { className: "flex flex-col items-start gap-0.5" };

        return (
          <Wrapper key={stat.label || index} {...wrapperProps}>
            <span
              className={`text-[22px] font-bold leading-none tracking-tight text-[#F5F5F5] ${
                isClickable
                  ? "group-hover:text-[#F5A623] transition-colors"
                  : ""
              }`}
            >
              {stat.value}
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#A3A3A3]">
              {stat.label}
            </span>
          </Wrapper>
        );
      })}
    </div>
  );
}