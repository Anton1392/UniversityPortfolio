using UnityEngine;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

public static class SaveSystem
{
    static string path = Application.persistentDataPath + "/player.quack";

    public static void SaveGameState(Cannon cn, EnemyHandler eh, MoneyHandler mh, PowerupHandler ph, WordHandler wh, TutorialKeyboard tk)
    {
        BinaryFormatter formatter = new BinaryFormatter();
        FileStream stream = new FileStream(path, FileMode.Create);

        SaveState state = new SaveState(cn, eh, mh, ph, wh, tk);
        formatter.Serialize(stream, state);

        stream.Close();
    }

    public static SaveState LoadGameState()
    {
        if(File.Exists(path))
        {
            BinaryFormatter formatter = new BinaryFormatter();
            FileStream stream = new FileStream(path, FileMode.Open);

            SaveState state = formatter.Deserialize(stream) as SaveState;

            stream.Close();

            return state;
        }
        else
        {
            Debug.Log("Save file not found in: " + path);
            return null;
        }
    }

    public static void ResetSave()
    {
        File.Delete(path);
    }
}
