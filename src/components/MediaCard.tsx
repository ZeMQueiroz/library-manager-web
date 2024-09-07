import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Stars } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../types/types';
import placeholder_anime from '../assets/placeholder_anime.png';
import placeholder_book from '../assets/placeholder_book.png';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="shadow-md cursor-pointer w-[180px] h-[318px] dark:bg-dark-300"
      onClick={() => navigate(`/media/${item.id}`, { state: item.title })}
    >
      <CardMedia
        component="img"
        className="h-[250px] object-cover"
        image={
          item.cover_url ||
          (item.category === 1 ? placeholder_book : placeholder_anime)
        }
        alt={item.title}
      />
      <CardContent
        style={{ margin: 0, padding: '4px 8px' }}
        className="p-0 m-0"
      >
        <Typography
          variant="subtitle1"
          component="div"
          className="truncate text-gray-200 "
          noWrap
          color="lightgray"
        >
          {item.title}
        </Typography>
        <div className="flex justify-between items-center mt-2">
          <Typography
            color="primary"
            variant="caption"
            className="dark:text-gray-400"
            noWrap
            style={{
              fontWeight: 'bold',
              color: (() => {
                switch (item.status) {
                  case 'To Read':
                  case 'To Watch':
                    return '#4B9CD3';
                  case 'Reading':
                  case 'Watching':
                    return '#7CFC00';
                  case 'Completed':
                    return '#2ECC71';
                  case 'On Hold':
                    return '#FFBF00';
                  case 'Dropped':
                    return '#E74C3C';
                  default:
                    return '#333';
                }
              })(),
            }}
          >
            {item.status}
          </Typography>
          <div className="flex items-center">
            <Stars className="text-gray-200" fontSize="small" />
            <Typography
              color="primary"
              variant="body2"
              className="text-gray-400 font-bold pl-1"
              noWrap
            >
              {item.rating ?? 'N/A'}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
