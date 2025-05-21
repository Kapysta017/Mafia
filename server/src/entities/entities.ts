import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => PlayerStat, (stat) => stat.player)
  stats: PlayerStat[];

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.player)
  gamePlayers: GamePlayer[];
}

@Entity('player_stats')
export class PlayerStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ default: 0 })
  totalGames: number;

  @Column({ default: 0 })
  gamesWon: number;

  @Column({ default: 0 })
  gamesLost: number;

  @Column({ type: 'float', default: 0 })
  winRate: number;
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ nullable: true })
  winner: string;

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
  players: GamePlayer[];
}

@Entity('game_players')
export class GamePlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, (game) => game.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => Player, (player) => player.gamePlayers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column()
  role: string;

  @Column({ default: false })
  isWinner: boolean;
}
