CREATE SCHEMA IF NOT EXISTS two_rooms_and_a_boom;

CREATE TABLE two_rooms_and_a_boom.team (
    teamId UUID PRIMARY KEY,
    colour text NOT NULL
);

INSERT INTO two_rooms_and_a_boom.team (teamId, colour) VALUES
('c10f2b88-7a2a-4a50-aade-7f96bde85215', 'blue'),
('ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'red'),
('8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'grey'),
('d82bc1da-0e02-4b87-837a-51ba97ecde4e', 'wild');

CREATE TABLE two_rooms_and_a_boom.player (
    playerId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE two_rooms_and_a_boom.card (
    cardId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cardTitle VARCHAR(45) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT false,
    isBasic BOOLEAN NOT NULL DEFAULT false,
    fileName VARCHAR(45) NOT NULL,
    teamId UUID NOT NULL
);

INSERT INTO two_rooms_and_a_boom.card (cardTitle, teamId, fileName) VALUES
('Blue Team', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'BlueTeam.png'),
('Red Team', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'RedTeam.png'),
('Agent', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Agent.png'),
('Agent','ef7f63f7-176b-4ff2-9fc9-4c01b2396baf' , 'Agent.png'),
('President', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'President.png'),
('Bomber', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Bomber.png'),
('Agoraphobe', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Agoraphobe.png'),
('Ahab', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Ahab.png'),
('Moby', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Moby.png'),
('Ambassador', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Ambassador.png'),
('Ambassador', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Ambassador.png'),
('Anarchist', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Anarchist.png'),
('Angel', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Angel.png'),
('Angel', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Angel.png'),
('Blind', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Blind.png'),
('Blind', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Blind.png'),
('Bomb-Bot', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'BombBot.png'),
('Queen', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Queen.png'),
('Bouncer', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Bouncer.png'),
('Bouncer', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Bouncer.png'),
('Butler', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Butler.png'),
('Maid', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Maid.png'),
('Clone', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Clone.png'),
('Clown', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Clown.png'),
('Clown', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Clown.png'),
('Conman', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Conman.png'),
('Conman', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Conman.png'),
('Coyboy', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Coyboy.png'),
('Coyboy', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Coyboy.png'),
('Criminal', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Criminal.png'),
('Criminal', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Criminal.png'),
('Cupid', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Cupid.png'),
('Eris', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Eris.png'),
('Dealer', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Dealer.png'),
('Dealer', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Dealer.png'),
('Decoy', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Decoy.png'),
('Target', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Target.png'),
('Sniper', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Sniper.png'),
('Demon', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Demon.png'),
('Demon', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Demon.png'),
('Doctor', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Doctor.png'),
('Dr. Boom', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'DrBoom.png'),
('Tuesday Knight', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'TuesdayKnight.png'),
('Drunk', 'd82bc1da-0e02-4b87-837a-51ba97ecde4e', 'Drunk.png'),
('Engineer', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Engineer.png'),
('Enforcer', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Enforcer.png'),
('Enforcer', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Enforcer.png'),
('Gambler', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Gambler.png'),
('Hot Potato', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'HotPotato.png'),
('Invincible', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Invincible.png'),
('Invincible', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Invincible.png'),
('Intern', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Intern.png'),
('Victim', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Victim.png'),
('Juliet', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Juliet.png'),
('Romeo', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Romeo.png'),
('Leprechaun', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Leprechaun.png'),
('Martyr', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Martyr.png'),
('President''s Daughter', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'PresidentsDaughter.png'),
('Mastermind', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Mastermind.png'),
('Mayor', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Mayor.png'),
('Mayor', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Mayor.png'),
('Medic', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Medic.png'),
('Medic', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Medic.png'),
('MI6', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'MI6.png'),
('Mime', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Mime.png'),
('Mime', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Mime.png'),
('Minion', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Minion.png'),
('Mistress', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Mistress.png'),
('Wife', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Wife.png'),
('Mummy', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Mummy.png'),
('Mummy', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Mummy.png'),
('Negotiator', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Negotiator.png'),
('Negotiator', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Negotiator.png'),
('Nuclear Tyrant', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'NuclearTyrant.png'),
('Nurse', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Nurse.png'),
('Tinkerer', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Tinkerer.png'),
('Paparazzo', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Paparazzo.png'),
('Paparazzo', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Paparazzo.png'),
('Paranoid', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Paranoid.png'),
('Paranoid', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Paranoid.png'),
('Private Eye', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'PrivateEye.png'),
('Psychologist', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Psychologist.png'),
('Psychologist', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Psychologist.png'),
('Rival', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Rival.png'),
('Survivor', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Survivor.png'),
('Robot', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Robot.png'),
('Security', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Security.png'),
('Security', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Security.png'),
('Shy Guy', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'ShyGuy.png'),
('Shy Guy', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'ShyGuy.png'),
('Spy', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Spy.png'),
('Spy', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Spy.png'),
('Thug', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Thug.png'),
('Thug', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Thug.png'),
('Traveler', '8c9ccb7d-81e7-4129-b1d9-f806d10ddeb6', 'Traveler.png'),
('Usurper', 'c10f2b88-7a2a-4a50-aade-7f96bde85215', 'Usurper.png'),
('Usurper', 'ef7f63f7-176b-4ff2-9fc9-4c01b2396baf', 'Usurper.png'),
('Zombie', 'd82bc1da-0e02-4b87-837a-51ba97ecde4e', 'Zombie.png');

UPDATE two_rooms_and_a_boom.card SET isBasic = true, isActive = true
WHERE cardTitle IN ('Red Team', 'Blue Team', 'President', 'Bomber', 'Gambler');

CREATE TABLE two_rooms_and_a_boom.gameState (
    gameId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gameState VARCHAR(20) NOT NULL CHECK (gameState IN ('WAITING_FOR_HOST','IN_PROGRESS','REVEAL_CARDS')),
    gameStartTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    matchEndTime TIMESTAMP NULL
);

INSERT INTO two_rooms_and_a_boom.gameState (gameId,gameState) VALUES (gen_random_uuid(),'WAITING_FOR_HOST');

CREATE TABLE two_rooms_and_a_boom.game (
    playerId UUID PRIMARY KEY,
    gameId UUID NOT NULL,
    cardId UUID NOT NULL,
    room VARCHAR(1) NOT NULL CHECK (room IN ('A', 'B'))
);