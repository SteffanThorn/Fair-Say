import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferredElectorate } = await request.json();

    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, {
      preferredElectorate: (preferredElectorate || '').trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[PATCH /api/account/electorate]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
