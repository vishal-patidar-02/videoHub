import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();
        const videos = await Video.find({}).populate('owner').limit(10).sort({createdAt: -1}).lean();
        if(!videos || videos.length === 0){
            return NextResponse.json(videos ?? [], { status: 200 });
        }
        return NextResponse.json(videos)
    } catch (error) {
        console.error("Video fatch Failed: ", error)
        return NextResponse.json(
            {error: "Failed to fatch videos"},
            {status: 500}
        )
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
           return NextResponse.json(
            {error: "Unautharized"},
            {status: 401  }
           ) 
        }
        
        const userId = session?.user.id;
        await connectToDatabase();
        const body: IVideo = await request.json();

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
           return NextResponse.json(
             {error: "Missing required values"},
             {status: 400}
           ); 
        }

        const videoData = {
            ...body,
            owner: userId,
            controls: body?.controls ?? true,
            transformation: {
              height: 1920,
              width: 1080,
              quality: body.transformation?.quality ?? 100 
            }
        }
        const newVideo = await Video.create(videoData);

        const user = await User.findOneAndUpdate(
            {_id:userId},
            { $push: { video: newVideo._id } },
            { new: true }
        );
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return NextResponse.json(newVideo);
    } catch (error) {
        console.error("Video creation failed: ", error);
        return NextResponse.json(
          {error: "Failed to create an video"},
            {status: 500}
        ); 
    }
}