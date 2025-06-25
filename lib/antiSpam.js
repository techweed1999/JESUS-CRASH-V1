const spamMap = new Map();
const blockedUsers = new Set();

function checkSpam(sender) {
  const now = Date.now();
  const user = spamMap.get(sender) || { count: 0, lastMessage: 0 };

  if (now - user.lastMessage < 5000) {
    user.count += 1;
  } else {
    user.count = 1;
  }

  user.lastMessage = now;
  spamMap.set(sender, user);

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
