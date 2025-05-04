declare module 'album-art' {
  function albumArt(
    artist: string,
    options?: { album?: string; size?: string }
  ): Promise<string>;
  export = albumArt;
} 