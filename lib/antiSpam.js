const spamMap = new Map();
const blockedUsers = new Set();

function checkSpam(sender) {
  const now = Date.now();
  const user = spamMap.get(sender) || { count: 0, lastMessage: 0 };

  // Si diferans tan ant dènye mesaj ak kounye a < 5 segonn
  if (now - user.lastMessage < 5000) {
    user.count += 1;
  } else {
    user.count = 1; // Rekòmanse konte si plis pase 5s pase
  }

  user.lastMessage = now;
  spamMap.set(sender, user);

  // Si plis pase 3 mesaj nan entèval kout, bloke
  if (user.count >= 3) {
    blockedUsers.add(sender);
    return true;
  }

  return false;
}

function isBlocked(sender) {
  return blockedUsers.has(sender);
}

function blockUser(sender) {
  blockedUsers.add(sender);
}

module.exports = {
  checkSpam,
  isBlocked,
  blockUser
};
