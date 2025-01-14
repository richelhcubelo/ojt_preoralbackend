import React from "react";
import "./announcement-card.scss";

interface CardProps {
  title: string;
  content: string;
  datePosted: string;
}

const AnnouncementCard: React.FC<CardProps> = ({
  title,
  content,
  datePosted,
}) => {
  return (
    <div className="reminder-card">
      <div className="card-title">{title}</div>
      <div className="card-content">{content}</div>
      <div className="card-footer">Date Posted: {datePosted}</div>
    </div>
  );
};

export default AnnouncementCard;
