import User from "../models/User.js";

// Get
export const getUser = async (req, res) => {
    try {
        // ambil id user dari params, misal kita klik profile orang, itu ada id nya, nah id nya itu kita bakal pakai 
        // untuk load informasi dari database dan kita tampilkan atau kasih ke frontend
        const { id } = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getUserFriends = async (req, res) => {
    try {
        // ambil id user dari params, misal kita klik profile orang, itu ada id nya, nah id nya itu kita bakal pakai 
            // untuk load informasi dari database dan kita tampilkan atau kasih ke frontend
            const { id } = req.params
            const user = await User.findById(id)

            // kita akan ambil friends aja dari user,
            // kita pakai Promise.all() karena kita akan memanggil banuak API ke database
            const friends = await Promise.all(
                // user -> friends (yg sudah kita buat di model atau tercantum di database / bisa disebut field)
                // map = mengeluarkan semua isi dari field friends dari si user nya, kalo ada 3 friends
                // berarti akan keluarin semua friends nya dan data2 friendsnya
                    user.friends.map((id) => User.findById(id))
            )

            // Nahh setelah mengeluarkan teman temannya dari si user tersebut, itu kan semua field ikut keluar yaahh.. jadi ..
            // kita akan mengambil field2 tertentu seperti yang kita cantumkan dibawah,
            // jadi tidak semua data/field friends nya yang kita ambil.
            const formattedFriends = friends.map(
                ({ _id, firstName, lastName, occupation, location, picturePath}) => {
                    return { _id, firstName, lastName, occupation, location, picturePath}
                }
            )
            res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// Update, add / remove teman
export const addRemoveFriend = async (req, res) => {
    try {
    //  ambil id user , dan id friend 
    const { id, friendId } = req.params
    const user = await User.findById(id) // kita dapet semua field/info si user
    const friend = await User.findById(friendId) // kita dapet field/info dari si teman nya

    // Jika ada friendId di documentnya si user, yang berarti itu kan udah tercantum gitu di field friends kan..
    // jadi kalo ketemu friendId di field friends nya user kita mau apus dia
    if (user.friends.includes(friendId)) {
        // ini bagian misal si database si usernya ( dari POV si user)
        user.friends = user.friends.filter((idFriends) => idFriends !== friendId) // ini kita mau filter/tampilin semua kecuali jika ada id yang sama dengan si friendId ini..
        // ini bagian database dari temannya ( POV si temannya )
        friend.friends = friend.friends.filter((idFriends) => idFriends !== id) // kita akan tampilin semua field friendsnya si teman user itu  kecuali si usernya
                                                                    // jadi tampilin semua pertemanan temannya kecuali dengan si user nya karena kan sudah tidak berteman
    } else { // nah ini kalo ga ada di friends field kita bisa add si user
        user.friends.push(friendId) // ini kita nambahin orang dari sisi user
        friend.friends.push(id) // ini ibaratnya bertambah juga ke field friends dari si sisi orang yang si user add

    }

    await user.save()
    await friend.save()
    

     const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
     )


     const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
     })

     res.status(200).json(formattedFriends)
        
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
} 