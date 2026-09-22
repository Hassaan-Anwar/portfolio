'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ComponentType } from 'react';
import type { InfoItem } from '@/data/info';
import StudioMasterSheet from './designs/StudioMasterSheet';
import Newspaper from './designs/Newspaper';
import GatefoldLinerDesign from './designs/GatefoldLiner';
import AlbumCover from './designs/AlbumCover';

interface InfoPanelProps {
  item: InfoItem;
}

const formatCredits = (credits?: string[]) => credits ? credits.join(', ') : '';

function GatefoldLiner({ item }: InfoPanelProps) {
  return <GatefoldLinerDesign item={item} isProject={'techStack' in item} />;
}

const INFO_DESIGNS = {
  'gatefold-liner': GatefoldLiner,
  'studio-master-sheet': StudioMasterSheet,
  'newspaper': Newspaper,
  'album-cover': AlbumCover,
} satisfies Record<InfoItem['infoDesign'], ComponentType<InfoPanelProps>>;

export default function InfoPanel(props: InfoPanelProps) {
  const Panel = INFO_DESIGNS[props.item.infoDesign];
  return <Panel {...props} />;
}
