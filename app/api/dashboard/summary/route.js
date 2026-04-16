import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import UserPollVote from '@/lib/models/UserPollVote';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [user, voteCount] = await Promise.all([
      User.findById(session.user.id).select('preferredElectorate newsletterSubscribed pollHistory createdAt').lean(),
      UserPollVote.countDocuments({ user: session.user.id }),
    ]);

    return NextResponse.json({
      preferredElectorate: user?.preferredElectorate || '',
      newsletterSubscribed: Boolean(user?.newsletterSubscribed),
      pollHistoryCount: user?.pollHistory?.length || 0,
      totalVotes: voteCount,
      joinedAt: user?.createdAt || null,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
